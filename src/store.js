import * as THREE from 'three';
import create from 'zustand';

const range = (from, to) => Array.from({ length: to - from + 1 }, (v, k) => k + from);

const mA = (active, dc) => {
  const limit = 1000.0; // at full duty cycle, consumes max 1000mA@24V
  const min = limit * (active ? dc : 0.002); // at % (duty cycle || quiescent), consumes minimum ...
  const max = min * (1.0 + 0.005); // at % duty cycle, consumes mininimum + 1%
  return Math.random() * (max - min + 1) + min;
};

const t = (active, dc) => {
  const min = (active ? dc : dc - (dc / 100) * 10.0) * 100 + 20;
  const max = min * (1.0 + 0.02);
  return Math.random() * (max - min + 1) + min;
};

const activeCoilIndex = range(1, 360).reduce((accumulator, {}, index) => {
  const angle = index + 1;
  if (angle === 360 || angle < 60) accumulator[angle] = 0;
  else if (angle >= 60 && angle < 120) accumulator[angle] = 1;
  else if (angle >= 120 && angle < 180) accumulator[angle] = 2;
  else if (angle >= 180 && angle < 240) accumulator[angle] = 3;
  else if (angle >= 240 && angle < 300) accumulator[angle] = 4;
  else if (angle >= 300 && angle < 360) accumulator[angle] = 5;
  return accumulator;
}, []);

const useStore = create((set, get) => {
  const path = process.env.REACT_APP_HTTP_PATH;
  const http = `${process.env.REACT_APP_HTTP_PROTOCOL}://${process.env.REACT_APP_HTTP_HOST}:${process.env.REACT_APP_HTTP_PORT}${path}`;
  const assets = `${process.env.REACT_APP_ASSETS_PROTOCOL}://${process.env.REACT_APP_ASSETS_HOST}:${process.env.REACT_APP_ASSETS_PORT}`;
  const engine = `${process.env.REACT_APP_ENGINE_PROTOCOL}://${process.env.REACT_APP_ENGINE_HOST}:${process.env.REACT_APP_ENGINE_PORT}`;

  return {
    navigation: {
      pages: {
        console: {
          active: true,
          link: '/home',
          title: 'Home',
          icon: 'faHome',
        },
        construction: {
          active: false,
          link: '/construction/overview',
          title: 'Overview',
          icon: 'faImages',
          pages: {
            overview: {
              active: false,
              link: '/construction/overview',
              title: 'Overview',
              icon: '',
            },
            prints: {
              active: false,
              link: '/construction/prints',
              title: '3D Prints',
              icon: '',
            },
            electronics: {
              active: false,
              link: '/construction/electronics',
              title: 'Electronics',
              icon: '',
            },
            code: {
              active: false,
              link: '/construction/code',
              title: 'Code',
              icon: '',
            },
          },
        },
        about: {
          active: false,
          link: '/contact',
          title: 'Contact',
          icon: 'faEnvelope',
        },
      },
      toggle: (page) =>
        set((state) => ({
          navigation: {
            ...state.navigation,
            pages: Object.keys(state.navigation.pages).reduce(
              (accumulator, key) => ({ ...accumulator, [key]: { ...accumulator[key], active: key === page } }),
              state.navigation.pages
            ),
          },
        })),
    },
    log: {
      messages: [{ date: new Date(), id: 'initial', status: 'warning', text: 'Engine disconnected.' }],
      add: (message) => {
        set((state) => ({
          log: {
            ...state.log,
            data: [...(state.log.data.length >= state.log.max ? state.log.data.slice(state.log.max * -1) : state.log.data.length), message],
          },
        }));
      },
      delete: (message) => {
        set((state) => ({
          log: {
            ...state.log,
            data: [...state.log.data.filter((item) => item !== message)],
          },
        }));
      },
      max: 1000,
    },

    api: {
      status: 'disconnected',
      socket: false,
      messages: [
        { date: new Date(), id: 'wsConnection', status: 'warning', text: 'Disconnected.' },
        { date: new Date(), id: 'wsDutycycle', status: 'warning', text: 'Unavailable.' },
      ],
      addMessage: (message) => {
        set({ api: { ...get().api, messages: [...get().api.messages, message] } });
      },
      url: new URL(engine),
      dc: 0.0,
      setDc: (dc) => set({ api: { ...get().api, dc } }),
      activeCoil: 0,
      setActiveCoil: (activeCoil) => set({ api: { ...get().api, activeCoil } }),
      interval: 500,
      setInterval: (interval) => set({ api: { ...get().api, interval } }),
      connect: () => {
        return new Promise((resolve, reject) => {
          if (get().api.status === 'disconnected') {
            set({
              api: {
                ...get().api,
                status: 'connecting',
                messages: [
                  ...get().api.messages,
                  {
                    id: 'wsConnection',
                    date: new Date(),
                    status: 'warning',
                    text: 'Connecting.',
                  },
                ],
              },
            });
            const socket = new WebSocket(get().api.url.toString());
            set({ api: { ...get().api, socket: socket } });
            socket.onmessage = (event) => {
              const data = JSON.parse(event.data);
              const [key] = Object.keys(data);
              switch (key) {
                case 'client':
                  set({
                    log: {
                      ...get().log,
                      messages: [
                        ...get().log.messages,
                        {
                          id: 'wsConnection',
                          date: new Date(),
                          status: 'success',
                          text: `${data.client}`,
                        },
                      ],
                    },
                    api: {
                      ...get().api,
                      messages: [
                        ...get().api.messages,
                        {
                          id: 'wsConnection',
                          date: new Date(),
                          status: 'success',
                          text: `${data.client}.`,
                        },
                      ],
                    },
                  });
                  break;

                case 'sample':
                  // merge api radian position with mimicked radian position
                  const duration = 0.017; // 1 second / 60 frames
                  const [sample] = get().api.metrics.slice(-1);
                  const radiansPerSecond = (data.sample.rpm / 60) * 2 * Math.PI;
                  const radiansPerFrame = radiansPerSecond * duration;
                  const r = (sample.r + radiansPerFrame) % (2 * Math.PI); // advace radians by a factor of duty-cycle
                  set({
                    log: {
                      ...get().log,
                      messages: [
                        ...get().log.messages,
                        {
                          id: 'wsReceivedSample',
                          date: new Date(),
                          status: 'success',
                          text: `sample: ${JSON.stringify(data.sample)}`,
                        },
                      ],
                    },
                    api: {
                      ...get().api,
                      metrics: [...get().api.metrics, { ...data.sample, r }].slice(-512),
                    },
                  });
                  break;

                case 'dc':
                  set({
                    log: {
                      ...get().log,
                      messages: [
                        ...get().log.messages,
                        {
                          id: 'wsDutycycle',
                          date: new Date(),
                          status: 'success',
                          text: `dc: ${JSON.stringify(data.dc)}, client: ${data.client}`,
                        },
                      ],
                    },
                    api: {
                      ...get().api,
                      dc: data.dc,
                      messages: [
                        ...get().api.messages,
                        {
                          id: 'wsDutycycle',
                          date: new Date(),
                          status: 'success',
                          text: `Updated by ${data.client}.`,
                        },
                      ],
                    },
                  });
                  break;

                default:
                  break;
              }
            };
            socket.onclose = (event) => {
              set({
                log: {
                  ...get().log,
                  messages: [
                    ...get().log.messages,
                    {
                      id: 'wsDisconnect',
                      date: new Date(),
                      status: event.code === 1000 ? 'warning' : 'error',
                      text: event.code === 1000 ? 'Disconnected.' : 'Failed.',
                    },
                  ],
                },
                api: {
                  ...get().api,
                  status: 'disconnected',
                  socket: false,
                  messages: [
                    ...get().api.messages,
                    {
                      id: 'wsConnection',
                      date: new Date(),
                      status: event.code === 1000 ? 'warning' : 'error',
                      text: event.code === 1000 ? 'Disconnected.' : 'Failed.',
                    },
                  ],
                },
              });
            };
            socket.onopen = () => {
              get().api.send({ dc: null });
              set({
                log: {
                  ...get().log,
                  messages: [
                    ...get().log.messages,
                    {
                      id: 'wsConnect',
                      date: new Date(),
                      status: 'success',
                      text: 'Connected.',
                    },
                  ],
                },
                api: {
                  ...get().api,
                  status: 'connected',
                  messages: [
                    ...get().api.messages,
                    {
                      id: 'wsConnection',
                      date: new Date(),
                      status: 'success',
                      text: 'Connected.',
                    },
                  ],
                },
              });
              resolve();
            };
            socket.onerror = (event) => {
              reject(event);
            };
          }
        });
      },

      close: () => {
        set({
          ...get().api,
          status: 'disconnecting',
          messages: [
            ...get().api.messages,
            {
              id: 'wsConnection',
              date: new Date(),
              status: 'warning',
              text: 'Disconnecting.',
            },
          ],
        });
        if (get().api.socket) {
          get().api.socket.close();
        } else {
          set({
            api: {
              ...get().api,
              status: 'disconnected',
            },
            log: {
              ...get().log,
              messages: [
                ...get().log.messages,
                {
                  id: 'wsDisconnect',
                  date: new Date(),
                  status: 'warning',
                  text: 'Already disconnected.',
                },
              ],
            },
          });
        }
      },

      send: (request) => {
        const [key] = Object.keys(request);
        const message = { id: 'wsConnectionSend', date: new Date(), status: 'success', text: `Message transmitted, ${JSON.stringify(request)}` };
        if (get().api.socket) {
          get().api.socket.send(JSON.stringify(request));
          set({
            log: {
              ...get().log,
              messages: [
                ...get().log.messages,
                {
                  ...message,
                  id: key === 'dc' ? 'wsDutycycle' : message.id,
                  text: key === 'dc' ? 'Updating.' : message.text,
                },
              ],
            },
            api: {
              ...get().api,
              messages: [...get().api.messages, message],
            },
          });
        } else {
          set({
            log: {
              ...get().log,
              messages: [
                ...get().log.messages,
                {
                  id: 'wsConnectionSend',
                  date: new Date(),
                  status: 'warning',
                  text: `Unable to send message, ${JSON.stringify(request)}, connection unavailable.`,
                },
              ],
            },
            api: {
              ...get().api,
              messages: [
                ...get().api.messages,
                {
                  ...message,
                  status: 'warning',
                  id: key === 'dc' ? 'wsDutycycle' : message.id,
                  text: key === 'dc' ? 'Unavailable.' : message.text,
                },
              ],
            },
          });
        }
      },
      metrics: [
        {
          ms: Date.now(),
          r: 2 * Math.PI,
          rpm: 0,
          c1: { mA: 0, t: 0 },
          c2: { mA: 0, t: 0 },
          c3: { mA: 0, t: 0 },
          c4: { mA: 0, t: 0 },
          c5: { mA: 0, t: 0 },
          c6: { mA: 0, t: 0 },
        },
      ],
      next: (duration) => {
        if (get().api.status === 'connected' && get().api.dc > 0) {
          const { dc, metrics } = get().api;
          const [sample] = metrics.slice(-1);
          const ms = Date.now();
          const radiansPerSecond = (sample.rpm / 60) * 6.283; // 2 * Math.PI = 6.2831...
          const radiansPerFrame = radiansPerSecond * duration;
          const r = (sample.r + radiansPerFrame) % 6.283; // 2 * Math.PI = 6.2831..., advace radians by a factor of duty-cycle
          const activeCoil = activeCoilIndex[Math.ceil(r * 57.2958)]; // 180 / Math.PI = 57.2957...
          set({
            api: {
              ...get().api,
              activeCoil: activeCoil,
              metrics: [
                ...get().api.metrics,
                {
                  ms,
                  r,
                  rpm: sample.rpm,
                  ...range(1, 6).reduce(
                    (accumulator, coil, index) => ({
                      ...accumulator,
                      [`c${coil}`]: { mA: mA(activeCoil === index, dc), t: t(activeCoil === index, dc) },
                    }),
                    {}
                  ),
                },
              ].slice(-512),
            },
          });
        }
      },
    },

    hud: {
      schematic: {
        dimensions: ['22.5%', '60%'],
        position: [20, 80],
        visible: false,
        maximized: true,
        icon: 'faProjectDiagram',
        setPosition: (position) => set({ hud: { ...get().hud, schematic: { ...get().hud.schematic, position } } }),
        setDimensions: (dimensions) => set({ hud: { ...get().hud, schematic: { ...get().hud.schematic, dimensions } } }),
        setVisible: (visible) => set({ hud: { ...get().hud, schematic: { ...get().hud.schematic, visible } } }),
        setMaximized: (maximized) => set({ hud: { ...get().hud, schematic: { ...get().hud.schematic, maximized } } }),
      },
      layers: {
        dimensions: ['15%', '60%'],
        position: [20, 80],
        visible: false,
        maximized: true,
        icon: 'faLayerGroup',
        setPosition: (position) => set({ hud: { ...get().hud, layers: { ...get().hud.layers, position: position } } }),
        setDimensions: (dimensions) => set({ hud: { ...get().hud, layers: { ...get().hud.layers, dimensions: dimensions } } }),
        setVisible: (visible) => set({ hud: { ...get().hud, layers: { ...get().hud.layers, visible: visible } } }),
        setMaximized: (maximized) => set({ hud: { ...get().hud, layers: { ...get().hud.layers, maximized: maximized } } }),
      },
      camera: {
        dimensions: ['30%', '55%'],
        position: [20, 80],
        visible: true,
        maximized: true,
        icon: 'faVideo',
        setPosition: (position) => set({ hud: { ...get().hud, camera: { ...get().hud.camera, position } } }),
        setDimensions: (dimensions) => set({ hud: { ...get().hud, camera: { ...get().hud.camera, dimensions } } }),
        setVisible: (visible) => set({ hud: { ...get().hud, camera: { ...get().hud.camera, visible } } }),
        setMaximized: (maximized) => set({ hud: { ...get().hud, camera: { ...get().hud.camera, maximized } } }),
      },
      log: {
        dimensions: ['22.5%', '30%'],
        position: [20, 80],
        visible: false,
        maximized: true,
        icon: 'faComment',
        setPosition: (position) => set({ hud: { ...get().hud, log: { ...get().hud.log, position } } }),
        setDimensions: (dimensions) => set({ hud: { ...get().hud, log: { ...get().hud.log, dimensions } } }),
        setVisible: (visible) => set({ hud: { ...get().hud, log: { ...get().hud.log, visible } } }),
        setMaximized: (maximized) => set({ hud: { ...get().hud, log: { ...get().hud.log, maximized } } }),
      },
      sinusoid: {
        visible: false,
        icon: 'faChartLine',
        setVisible: (visible) => set({ hud: { ...get().hud, sinusoid: { ...get().hud.sinusoid, visible: visible } } }),
      },
    },

    journals: {
      models: {
        journalBottomForAxleOfCodewheelAndSensor: {
          visible: true,
          toggle: () =>
            set((state) => ({
              journals: {
                ...state.journals,
                models: {
                  ...state.journals.models,
                  journalBottomForAxleOfCodewheelAndSensor: {
                    ...state.journals.models.journalBottomForAxleOfCodewheelAndSensor,
                    visible: !state.journals.models.journalBottomForAxleOfCodewheelAndSensor.visible,
                  },
                },
              },
            })),
        },
        journalBottomForFrontFacingVHinge: {
          visible: true,
          toggle: () =>
            set((state) => ({
              journals: {
                ...state.journals,
                models: {
                  ...state.journals.models,
                  journalBottomForFrontFacingVHinge: {
                    ...state.journals.models.journalBottomForFrontFacingVHinge,
                    visible: !state.journals.models.journalBottomForFrontFacingVHinge.visible,
                  },
                },
              },
            })),
        },
        journalBottomForRearFacingVHinge: {
          visible: true,
          toggle: () =>
            set((state) => ({
              journals: {
                ...state.journals,
                models: {
                  ...state.journals.models,
                  journalBottomForRearFacingVHinge: {
                    ...state.journals.models.journalBottomForRearFacingVHinge,
                    visible: !state.journals.models.journalBottomForRearFacingVHinge.visible,
                  },
                },
              },
            })),
        },
        journalTopForAxleOfCodewheelAndSensor: {
          visible: true,
          toggle: () =>
            set((state) => ({
              journals: {
                ...state.journals,
                models: {
                  ...state.journals.models,
                  journalTopForAxleOfCodewheelAndSensor: {
                    ...state.journals.models.journalTopForAxleOfCodewheelAndSensor,
                    visible: !state.journals.models.journalTopForAxleOfCodewheelAndSensor.visible,
                  },
                },
              },
            })),
        },
        journalTopForFrontFacingVHinge: {
          visible: true,
          toggle: () =>
            set((state) => ({
              journals: {
                ...state.journals,
                models: {
                  ...state.journals.models,
                  journalTopForFrontFacingVHinge: {
                    ...state.journals.models.journalTopForFrontFacingVHinge,
                    visible: !state.journals.models.journalTopForFrontFacingVHinge.visible,
                  },
                },
              },
            })),
        },
        journalTopForRearFacingVHinge: {
          visible: true,
          toggle: () =>
            set((state) => ({
              journals: {
                ...state.journals,
                models: {
                  ...state.journals.models,
                  journalTopForRearFacingVHinge: {
                    ...state.journals.models.journalTopForRearFacingVHinge,
                    visible: !state.journals.models.journalTopForRearFacingVHinge.visible,
                  },
                },
              },
            })),
        },
        journalBottomForAxleOfMainConrods1And2: {
          visible: true,
          toggle: () =>
            set((state) => ({
              journals: {
                ...state.journals,
                models: {
                  ...state.journals.models,
                  journalBottomForAxleOfMainConrods1And2: {
                    ...state.journals.models.journalBottomForAxleOfMainConrods1And2,
                    visible: !state.journals.models.journalBottomForAxleOfMainConrods1And2.visible,
                  },
                },
              },
            })),
        },
        journalBottomForAxleOfMainConrods3And4: {
          visible: true,
          toggle: () =>
            set((state) => ({
              journals: {
                ...state.journals,
                models: {
                  ...state.journals.models,
                  journalBottomForAxleOfMainConrods3And4: {
                    ...state.journals.models.journalBottomForAxleOfMainConrods3And4,
                    visible: !state.journals.models.journalBottomForAxleOfMainConrods3And4.visible,
                  },
                },
              },
            })),
        },
        journalBottomForAxleOfMainConrods5And6: {
          visible: true,
          toggle: () =>
            set((state) => ({
              journals: {
                ...state.journals,
                models: {
                  ...state.journals.models,
                  journalBottomForAxleOfMainConrods5And6: {
                    ...state.journals.models.journalBottomForAxleOfMainConrods5And6,
                    visible: !state.journals.models.journalBottomForAxleOfMainConrods5And6.visible,
                  },
                },
              },
            })),
        },
        journalBottomForAxleOfCodewheel: {
          visible: true,
          toggle: () =>
            set((state) => ({
              journals: {
                ...state.journals,
                models: {
                  ...state.journals.models,
                  journalBottomForAxleOfCodewheel: {
                    ...state.journals.models.journalBottomForAxleOfCodewheel,
                    visible: !state.journals.models.journalBottomForAxleOfCodewheel.visible,
                  },
                },
              },
            })),
        },
        journalTopForAxleOfMainConrods1And2: {
          visible: true,
          toggle: () =>
            set((state) => ({
              journals: {
                ...state.journals,
                models: {
                  ...state.journals.models,
                  journalTopForAxleOfMainConrods1And2: {
                    ...state.journals.models.journalTopForAxleOfMainConrods1And2,
                    visible: !state.journals.models.journalTopForAxleOfMainConrods1And2.visible,
                  },
                },
              },
            })),
        },
        journalTopForAxleOfMainConrods3And4: {
          visible: true,
          toggle: () =>
            set((state) => ({
              journals: {
                ...state.journals,
                models: {
                  ...state.journals.models,
                  journalTopForAxleOfMainConrods3And4: {
                    ...state.journals.models.journalTopForAxleOfMainConrods3And4,
                    visible: !state.journals.models.journalTopForAxleOfMainConrods3And4.visible,
                  },
                },
              },
            })),
        },
        journalTopForAxleOfMainConrods5And6: {
          visible: true,
          toggle: () =>
            set((state) => ({
              journals: {
                ...state.journals,
                models: {
                  ...state.journals.models,
                  journalTopForAxleOfMainConrods5And6: {
                    ...state.journals.models.journalTopForAxleOfMainConrods5And6,
                    visible: !state.journals.models.journalTopForAxleOfMainConrods5And6.visible,
                  },
                },
              },
            })),
        },
        journalTopForAxleOfCodewheel: {
          visible: true,
          toggle: () =>
            set((state) => ({
              journals: {
                ...state.journals,
                models: {
                  ...state.journals.models,
                  journalTopForAxleOfCodewheel: {
                    ...state.journals.models.journalTopForAxleOfCodewheel,
                    visible: !state.journals.models.journalTopForAxleOfCodewheel.visible,
                  },
                },
              },
            })),
        },
      },
    },

    frame: {
      models: {
        conduit001: {
          visible: true,
          toggle: () =>
            set((state) => ({
              frame: {
                ...state.frame,
                models: {
                  ...state.frame.models,
                  conduit001: { ...state.frame.models.conduit001, visible: !state.frame.models.conduit001.visible },
                },
              },
            })),
        },
        conduit002: {
          visible: true,
          toggle: () =>
            set((state) => ({
              frame: {
                ...state.frame,
                models: {
                  ...state.frame.models,
                  conduit002: { ...state.frame.models.conduit002, visible: !state.frame.models.conduit002.visible },
                },
              },
            })),
        },
        conduit003: {
          visible: true,
          toggle: () =>
            set((state) => ({
              frame: {
                ...state.frame,
                models: {
                  ...state.frame.models,
                  conduit003: { ...state.frame.models.conduit003, visible: !state.frame.models.conduit003.visible },
                },
              },
            })),
        },
        conduit004: {
          visible: true,
          toggle: () =>
            set((state) => ({
              frame: {
                ...state.frame,
                models: {
                  ...state.frame.models,
                  conduit004: { ...state.frame.models.conduit004, visible: !state.frame.models.conduit004.visible },
                },
              },
            })),
        },
        conduit005: {
          visible: true,
          toggle: () =>
            set((state) => ({
              frame: {
                ...state.frame,
                models: {
                  ...state.frame.models,
                  conduit005: { ...state.frame.models.conduit005, visible: !state.frame.models.conduit005.visible },
                },
              },
            })),
        },
        conduit006: {
          visible: true,
          toggle: () =>
            set((state) => ({
              frame: {
                ...state.frame,
                models: {
                  ...state.frame.models,
                  conduit006: { ...state.frame.models.conduit006, visible: !state.frame.models.conduit006.visible },
                },
              },
            })),
        },
        conduit007: {
          visible: true,
          toggle: () =>
            set((state) => ({
              frame: {
                ...state.frame,
                models: {
                  ...state.frame.models,
                  conduit007: { ...state.frame.models.conduit007, visible: !state.frame.models.conduit007.visible },
                },
              },
            })),
        },
        conduit008: {
          visible: true,
          toggle: () =>
            set((state) => ({
              frame: {
                ...state.frame,
                models: {
                  ...state.frame.models,
                  conduit008: { ...state.frame.models.conduit008, visible: !state.frame.models.conduit008.visible },
                },
              },
            })),
        },
        conduit009: {
          visible: true,
          toggle: () =>
            set((state) => ({
              frame: {
                ...state.frame,
                models: {
                  ...state.frame.models,
                  conduit009: { ...state.frame.models.conduit009, visible: !state.frame.models.conduit009.visible },
                },
              },
            })),
        },
        conduit010: {
          visible: true,
          toggle: () =>
            set((state) => ({
              frame: {
                ...state.frame,
                models: {
                  ...state.frame.models,
                  conduit010: { ...state.frame.models.conduit010, visible: !state.frame.models.conduit010.visible },
                },
              },
            })),
        },
        conduit011: {
          visible: true,
          toggle: () =>
            set((state) => ({
              frame: {
                ...state.frame,
                models: {
                  ...state.frame.models,
                  conduit011: { ...state.frame.models.conduit011, visible: !state.frame.models.conduit011.visible },
                },
              },
            })),
        },
        conduit012: {
          visible: true,
          toggle: () =>
            set((state) => ({
              frame: {
                ...state.frame,
                models: {
                  ...state.frame.models,
                  conduit012: { ...state.frame.models.conduit012, visible: !state.frame.models.conduit012.visible },
                },
              },
            })),
        },
        conduit013: {
          visible: true,
          toggle: () =>
            set((state) => ({
              frame: {
                ...state.frame,
                models: {
                  ...state.frame.models,
                  conduit013: { ...state.frame.models.conduit013, visible: !state.frame.models.conduit013.visible },
                },
              },
            })),
        },
        conduit014: {
          visible: true,
          toggle: () =>
            set((state) => ({
              frame: {
                ...state.frame,
                models: {
                  ...state.frame.models,
                  conduit014: { ...state.frame.models.conduit014, visible: !state.frame.models.conduit014.visible },
                },
              },
            })),
        },

        frontFacingLeftElbow: {
          visible: true,
          toggle: () =>
            set((state) => ({
              frame: {
                ...state.frame,
                models: {
                  ...state.frame.models,
                  frontFacingLeftElbow: {
                    ...state.frame.models.frontFacingLeftElbow,
                    visible: !state.frame.models.frontFacingLeftElbow.visible,
                  },
                },
              },
            })),
        },
        frontFacingRightElbow: {
          visible: true,
          toggle: () =>
            set((state) => ({
              frame: {
                ...state.frame,
                models: {
                  ...state.frame.models,
                  frontFacingRightElbow: {
                    ...state.frame.models.frontFacingRightElbow,
                    visible: !state.frame.models.frontFacingRightElbow.visible,
                  },
                },
              },
            })),
        },
        rearFacingLeftElbow: {
          visible: true,
          toggle: () =>
            set((state) => ({
              frame: {
                ...state.frame,
                models: {
                  ...state.frame.models,
                  rearFacingLeftElbow: {
                    ...state.frame.models.rearFacingLeftElbow,
                    visible: !state.frame.models.rearFacingLeftElbow.visible,
                  },
                },
              },
            })),
        },
        rearFacingRightElbow: {
          visible: true,
          toggle: () =>
            set((state) => ({
              frame: {
                ...state.frame,
                models: {
                  ...state.frame.models,
                  rearFacingRightElbow: {
                    ...state.frame.models.rearFacingRightElbow,
                    visible: !state.frame.models.rearFacingRightElbow.visible,
                  },
                },
              },
            })),
        },

        frontFacingLeftVHinge: {
          visible: true,
          toggle: () =>
            set((state) => ({
              frame: {
                ...state.frame,
                models: {
                  ...state.frame.models,
                  frontFacingLeftVHinge: {
                    ...state.frame.models.frontFacingLeftVHinge,
                    visible: !state.frame.models.frontFacingLeftVHinge.visible,
                  },
                },
              },
            })),
        },
        frontFacingRightVHinge: {
          visible: true,
          toggle: () =>
            set((state) => ({
              frame: {
                ...state.frame,
                models: {
                  ...state.frame.models,
                  frontFacingRightVHinge: {
                    ...state.frame.models.frontFacingRightVHinge,
                    visible: !state.frame.models.frontFacingRightVHinge.visible,
                  },
                },
              },
            })),
        },
        rearFacingLeftVHinge: {
          visible: true,
          toggle: () =>
            set((state) => ({
              frame: {
                ...state.frame,
                models: {
                  ...state.frame.models,
                  rearFacingLeftVHinge: {
                    ...state.frame.models.rearFacingLeftVHinge,
                    visible: !state.frame.models.rearFacingLeftVHinge.visible,
                  },
                },
              },
            })),
        },
        rearFacingRightVHinge: {
          visible: true,
          toggle: () =>
            set((state) => ({
              frame: {
                ...state.frame,
                models: {
                  ...state.frame.models,
                  rearFacingRightVHinge: {
                    ...state.frame.models.rearFacingRightVHinge,
                    visible: !state.frame.models.rearFacingRightVHinge.visible,
                  },
                },
              },
            })),
        },

        rightRailCoilHolder1: {
          visible: true,
          toggle: () =>
            set((state) => ({
              frame: {
                ...state.frame,
                models: {
                  ...state.frame.models,
                  rightRailCoilHolder1: {
                    ...state.frame.models.rightRailCoilHolder1,
                    visible: !state.frame.models.rightRailCoilHolder1.visible,
                  },
                },
              },
            })),
        },
        leftRailCoilHolder2: {
          visible: true,
          toggle: () =>
            set((state) => ({
              frame: {
                ...state.frame,
                models: {
                  ...state.frame.models,
                  leftRailCoilHolder2: {
                    ...state.frame.models.leftRailCoilHolder2,
                    visible: !state.frame.models.leftRailCoilHolder2.visible,
                  },
                },
              },
            })),
        },
        rightRailCoilHolder3: {
          visible: true,
          toggle: () =>
            set((state) => ({
              frame: {
                ...state.frame,
                models: {
                  ...state.frame.models,
                  rightRailCoilHolder3: {
                    ...state.frame.models.rightRailCoilHolder3,
                    visible: !state.frame.models.rightRailCoilHolder3.visible,
                  },
                },
              },
            })),
        },
        leftRailCoilHolder4: {
          visible: true,
          toggle: () =>
            set((state) => ({
              frame: {
                ...state.frame,
                models: {
                  ...state.frame.models,
                  leftRailCoilHolder4: {
                    ...state.frame.models.leftRailCoilHolder4,
                    visible: !state.frame.models.leftRailCoilHolder4.visible,
                  },
                },
              },
            })),
        },
        rightRailCoilHolder5: {
          visible: true,
          toggle: () =>
            set((state) => ({
              frame: {
                ...state.frame,
                models: {
                  ...state.frame.models,
                  rightRailCoilHolder5: {
                    ...state.frame.models.rightRailCoilHolder5,
                    visible: !state.frame.models.rightRailCoilHolder5.visible,
                  },
                },
              },
            })),
        },
        leftRailCoilHolder6: {
          visible: true,
          toggle: () =>
            set((state) => ({
              frame: {
                ...state.frame,
                models: {
                  ...state.frame.models,
                  leftRailCoilHolder6: {
                    ...state.frame.models.leftRailCoilHolder6,
                    visible: !state.frame.models.leftRailCoilHolder6.visible,
                  },
                },
              },
            })),
        },

        leftRailLEDEncoder: {
          visible: true,
          toggle: () =>
            set((state) => ({
              frame: {
                ...state.frame,
                models: {
                  ...state.frame.models,
                  leftRailLEDEncoder: {
                    ...state.frame.models.leftRailLEDEncoder,
                    visible: !state.frame.models.leftRailLEDEncoder.visible,
                  },
                },
              },
            })),
        },
        rightRailLEDEncoder: {
          visible: true,
          toggle: () =>
            set((state) => ({
              frame: {
                ...state.frame,
                models: {
                  ...state.frame.models,
                  rightRailLEDEncoder: {
                    ...state.frame.models.rightRailLEDEncoder,
                    visible: !state.frame.models.rightRailLEDEncoder.visible,
                  },
                },
              },
            })),
        },
      },
    },

    coils: {
      models: {
        coil1: {
          position: [71.1, 0, 142.6],
          rotation: [0, THREE.Math.degToRad(-90), 0],
          visible: true,
          toggle: () =>
            set((state) => ({
              coils: {
                ...state.coils,
                models: {
                  ...state.coils.models,
                  coil1: { ...state.coils.models.coil1, visible: !state.coils.models.coil1.visible },
                },
              },
            })),
        }, // , annotation:{ text:'coil 0° to 60°', position:[130, -13, 142.6], orientation:['right', 'middle'] }
        coil2: {
          position: [-71.1, 0, 130.5],
          rotation: [0, THREE.Math.degToRad(90), 0],
          visible: true,
          toggle: () =>
            set((state) => ({
              coils: {
                ...state.coils,
                models: {
                  ...state.coils.models,
                  coil2: { ...state.coils.models.coil2, visible: !state.coils.models.coil2.visible },
                },
              },
            })),
        }, // , annotation:{ text:'coil 180° to 240°', position:[-130, -13, 130.5], orientation:['left', 'middle'] }
        coil3: {
          position: [71.1, 0, 93.1],
          rotation: [0, THREE.Math.degToRad(-90), 0],
          visible: true,
          toggle: () =>
            set((state) => ({
              coils: {
                ...state.coils,
                models: {
                  ...state.coils.models,
                  coil3: { ...state.coils.models.coil3, visible: !state.coils.models.coil3.visible },
                },
              },
            })),
        }, // , annotation:{ text:'coil 60° to 120°', position:[130, -13, 93.1], orientation:['right', 'middle'] }
        coil4: {
          position: [-71.1, 0, 81],
          rotation: [0, THREE.Math.degToRad(90), 0],
          visible: true,
          toggle: () =>
            set((state) => ({
              coils: {
                ...state.coils,
                models: {
                  ...state.coils.models,
                  coil4: { ...state.coils.models.coil4, visible: !state.coils.models.coil4.visible },
                },
              },
            })),
        }, // , annotation:{ text:'coil 240° to 300°', position:[-130, -13, 81], orientation:['left', 'middle'] }
        coil5: {
          position: [71.1, 0, 43.7],
          rotation: [0, THREE.Math.degToRad(-90), 0],
          visible: true,
          toggle: () =>
            set((state) => ({
              coils: {
                ...state.coils,
                models: {
                  ...state.coils.models,
                  coil5: { ...state.coils.models.coil5, visible: !state.coils.models.coil5.visible },
                },
              },
            })),
        }, // , annotation:{ text:'coil 120° to 180°', position:[130, -13, 43.7], orientation:['right', 'middle'] }
        coil6: {
          position: [-71.1, 0, 31.6],
          rotation: [0, THREE.Math.degToRad(90), 0],
          visible: true,
          toggle: () =>
            set((state) => ({
              coils: {
                ...state.coils,
                models: {
                  ...state.coils.models,
                  coil6: { ...state.coils.models.coil6, visible: !state.coils.models.coil6.visible },
                },
              },
            })),
        }, // , annotation:{ text:'coil 300° to 360°', position:[-130, -13, 31.6], orientation:['left', 'middle'] }
      },
    },

    sensors: {
      models: {
        leftLEDEncoder: {
          visible: true,
          toggle: () =>
            set((state) => ({
              sensors: {
                ...state.sensors,
                models: {
                  ...state.sensors.models,
                  leftLEDEncoder: {
                    ...state.sensors.models.leftLEDEncoder,
                    visible: !state.sensors.models.leftLEDEncoder.visible,
                  },
                },
              },
            })),
        },
        leftLEDEncoderPeg: {
          visible: true,
          toggle: () =>
            set((state) => ({
              sensors: {
                ...state.sensors,
                models: {
                  ...state.sensors.models,
                  leftLEDEncoderPeg: {
                    ...state.sensors.models.leftLEDEncoderPeg,
                    visible: !state.sensors.models.leftLEDEncoderPeg.visible,
                  },
                },
              },
            })),
        },

        reflectiveEncoder: {
          visible: true,
          toggle: () =>
            set((state) => ({
              sensors: {
                ...state.sensors,
                models: {
                  ...state.sensors.models,
                  reflectiveEncoder: {
                    ...state.sensors.models.reflectiveEncoder,
                    visible: !state.sensors.models.reflectiveEncoder.visible,
                  },
                },
              },
            })),
        },
        reflectiveEncoderPeg: {
          visible: true,
          toggle: () =>
            set((state) => ({
              sensors: {
                ...state.sensors,
                models: {
                  ...state.sensors.models,
                  reflectiveEncoderPeg: {
                    ...state.sensors.models.reflectiveEncoderPeg,
                    visible: !state.sensors.models.reflectiveEncoderPeg.visible,
                  },
                },
              },
            })),
        },

        rightLEDEncoder: {
          visible: true,
          toggle: () =>
            set((state) => ({
              sensors: {
                ...state.sensors,
                models: {
                  ...state.sensors.models,
                  rightLEDEncoder: {
                    ...state.sensors.models.rightLEDEncoder,
                    visible: !state.sensors.models.rightLEDEncoder.visible,
                  },
                },
              },
            })),
        },
        rightLEDEncoderPeg: {
          visible: true,
          toggle: () =>
            set((state) => ({
              sensors: {
                ...state.sensors,
                models: {
                  ...state.sensors.models,
                  rightLEDEncoderPeg: {
                    ...state.sensors.models.rightLEDEncoderPeg,
                    visible: !state.sensors.models.rightLEDEncoderPeg.visible,
                  },
                },
              },
            })),
        },
      },
    },

    crankshaft: {
      models: {
        frontSpacerAxle: {
          position: [0, 0, -36.885],
          visible: true,
          toggle: () =>
            set((state) => ({
              crankshaft: {
                ...state.crankshaft,
                models: {
                  ...state.crankshaft.models,
                  frontSpacerAxle: {
                    ...state.crankshaft.models.frontSpacerAxle,
                    visible: !state.crankshaft.models.frontSpacerAxle.visible,
                  },
                },
              },
            })),
        },
        crank6d120: {
          position: [0, 0, 12.615],
          visible: true,
          toggle: () =>
            set((state) => ({
              crankshaft: {
                ...state.crankshaft,
                models: {
                  ...state.crankshaft.models,
                  crank6d120: {
                    ...state.crankshaft.models.crank6d120,
                    visible: !state.crankshaft.models.crank6d120.visible,
                  },
                },
              },
            })),
        },
        crankAxleForConrods1And2: {
          position: [-2.759, 4.758, 37.454],
          visible: true,
          toggle: () =>
            set((state) => ({
              crankshaft: {
                ...state.crankshaft,
                models: {
                  ...state.crankshaft.models,
                  crankAxleForConrods1And2: {
                    ...state.crankshaft.models.crankAxleForConrods1And2,
                    visible: !state.crankshaft.models.crankAxleForConrods1And2.visible,
                  },
                },
              },
            })),
        }, // , annotation:{ text:'240° crank', position:[170, 13, 37.454], orientation:['right', 'middle'] }
        crank5d0: {
          position: [0, 0, 62.154],
          visible: true,
          toggle: () =>
            set((state) => ({
              crankshaft: {
                ...state.crankshaft,
                models: {
                  ...state.crankshaft.models,
                  crank5d0: { ...state.crankshaft.models.crank5d0, visible: !state.crankshaft.models.crank5d0.visible },
                },
              },
            })),
        },
        crank4d120: {
          position: [0, 0, 62.154],
          visible: true,
          toggle: () =>
            set((state) => ({
              crankshaft: {
                ...state.crankshaft,
                models: {
                  ...state.crankshaft.models,
                  crank4d120: {
                    ...state.crankshaft.models.crank4d120,
                    visible: !state.crankshaft.models.crank4d120.visible,
                  },
                },
              },
            })),
        },
        crankAxleForConrods3And4: {
          position: [-2.759, -4.768, 86.954],
          visible: true,
          toggle: () =>
            set((state) => ({
              crankshaft: {
                ...state.crankshaft,
                models: {
                  ...state.crankshaft.models,
                  crankAxleForConrods3And4: {
                    ...state.crankshaft.models.crankAxleForConrods3And4,
                    visible: !state.crankshaft.models.crankAxleForConrods3And4.visible,
                  },
                },
              },
            })),
        }, // , annotation:{ text:'120° crank', position:[170, 13, 86.954], orientation:['right', 'middle'] }
        crank3d0: {
          position: [0, 0, 111.75],
          visible: true,
          toggle: () =>
            set((state) => ({
              crankshaft: {
                ...state.crankshaft,
                models: {
                  ...state.crankshaft.models,
                  crank3d0: { ...state.crankshaft.models.crank3d0, visible: !state.crankshaft.models.crank3d0.visible },
                },
              },
            })),
        },
        crank2d120: {
          position: [0, 0, 111.75],
          visible: true,
          toggle: () =>
            set((state) => ({
              crankshaft: {
                ...state.crankshaft,
                models: {
                  ...state.crankshaft.models,
                  crank2d120: {
                    ...state.crankshaft.models.crank2d120,
                    visible: !state.crankshaft.models.crank2d120.visible,
                  },
                },
              },
            })),
        },
        crankAxleForConrods5And6: {
          position: [5.491, 0, 136.55],
          visible: true,
          toggle: () =>
            set((state) => ({
              crankshaft: {
                ...state.crankshaft,
                models: {
                  ...state.crankshaft.models,
                  crankAxleForConrods5And6: {
                    ...state.crankshaft.models.crankAxleForConrods5And6,
                    visible: !state.crankshaft.models.crankAxleForConrods5And6.visible,
                  },
                },
              },
            })),
        }, // , annotation:{ text:'0° crank', position:[170, 13, 136.55], orientation:['right', 'middle'] }
        crank1d0: {
          position: [0, 0, 161.35],
          visible: true,
          toggle: () =>
            set((state) => ({
              crankshaft: {
                ...state.crankshaft,
                models: {
                  ...state.crankshaft.models,
                  crank1d0: { ...state.crankshaft.models.crank1d0, visible: !state.crankshaft.models.crank1d0.visible },
                },
              },
            })),
        },
        codewheel: {
          position: [0, 0, -36.885],
          visible: true,
          toggle: () =>
            set((state) => ({
              crankshaft: {
                ...state.crankshaft,
                models: {
                  ...state.crankshaft.models,
                  codewheel: {
                    ...state.crankshaft.models.codewheel,
                    visible: !state.crankshaft.models.codewheel.visible,
                  },
                },
              },
            })),
        }, // , annotation:{ text:'codewheel', position:[170, 13, -16.885], orientation:['right', 'middle'] }
        codewheelBackplate: {
          position: [0, 0, 12.615],
          visible: true,
          toggle: () =>
            set((state) => ({
              crankshaft: {
                ...state.crankshaft,
                models: {
                  ...state.crankshaft.models,
                  codewheelBackplate: {
                    ...state.crankshaft.models.codewheelBackplate,
                    visible: !state.crankshaft.models.codewheelBackplate.visible,
                  },
                },
              },
            })),
        },
        rearSpacerAxle: {
          position: [0, 0, 161.35],
          visible: true,
          toggle: () =>
            set((state) => ({
              crankshaft: {
                ...state.crankshaft,
                models: {
                  ...state.crankshaft.models,
                  rearSpacerAxle: {
                    ...state.crankshaft.models.rearSpacerAxle,
                    visible: !state.crankshaft.models.rearSpacerAxle.visible,
                  },
                },
              },
            })),
        },
      },
    },

    pistons: {
      conrod: {},
      plunger: {},
      models: {
        piston1: {
          position: [0, 0, 142.6],
          offsetAngle: 0,
          offsetRotation: 0,
          visible: true,
          toggle: () =>
            set((state) => ({
              pistons: {
                ...state.pistons,
                models: {
                  ...state.pistons.models,
                  piston1: { ...state.pistons.models.piston1, visible: !state.pistons.models.piston1.visible },
                },
              },
            })),
        },
        piston2: {
          position: [0, 0, 130.5],
          offsetAngle: Math.PI,
          offsetRotation: THREE.Math.degToRad(180),
          visible: true,
          toggle: () =>
            set((state) => ({
              pistons: {
                ...state.pistons,
                models: {
                  ...state.pistons.models,
                  piston2: { ...state.pistons.models.piston2, visible: !state.pistons.models.piston2.visible },
                },
              },
            })),
        },
        piston3: {
          position: [0, 0, 93.1],
          offsetAngle: 0,
          offsetRotation: THREE.Math.degToRad(240),
          visible: true,
          toggle: () =>
            set((state) => ({
              pistons: {
                ...state.pistons,
                models: {
                  ...state.pistons.models,
                  piston3: { ...state.pistons.models.piston3, visible: !state.pistons.models.piston3.visible },
                },
              },
            })),
        },
        piston4: {
          position: [0, 0, 81],
          offsetAngle: Math.PI,
          offsetRotation: THREE.Math.degToRad(60),
          visible: true,
          toggle: () =>
            set((state) => ({
              pistons: {
                ...state.pistons,
                models: {
                  ...state.pistons.models,
                  piston4: { ...state.pistons.models.piston4, visible: !state.pistons.models.piston4.visible },
                },
              },
            })),
        },
        piston5: {
          position: [0, 0, 43.7],
          offsetAngle: 0,
          offsetRotation: THREE.Math.degToRad(120),
          visible: true,
          toggle: () =>
            set((state) => ({
              pistons: {
                ...state.pistons,
                models: {
                  ...state.pistons.models,
                  piston5: { ...state.pistons.models.piston5, visible: !state.pistons.models.piston5.visible },
                },
              },
            })),
        },
        piston6: {
          position: [0, 0, 31.6],
          offsetAngle: Math.PI,
          offsetRotation: THREE.Math.degToRad(300),
          visible: true,
          toggle: () =>
            set((state) => ({
              pistons: {
                ...state.pistons,
                models: {
                  ...state.pistons.models,
                  piston6: { ...state.pistons.models.piston6, visible: !state.pistons.models.piston6.visible },
                },
              },
            })),
        },
      },
    },
  };
});

export default useStore;
