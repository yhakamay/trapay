import { Event } from "./types/event";

export const events: Array<Event> = [
  {
    id: "1",
    title: "Event 1",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris posuere nunc vel est placerat consequat. Pellentesque malesuada pharetra risus. ",
    date: "2020-01-01",
    createdAt: new Date().toISOString(),
    imageUrl: "https://picsum.photos/200/300",
    payments: [
      {
        id: "1",
        title: "Payment 1",
        amount: 100,
        createdAt: new Date().toISOString(),
        paidBy: "Yusuke",
      },
      {
        id: "2",
        title: "Payment 2",
        amount: 200,
        createdAt: new Date().toISOString(),
        paidBy: "Yusuke",
      },
    ],
  },
  {
    id: "2",
    title: "Event 2",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris posuere nunc vel est placerat consequat. Pellentesque malesuada pharetra risus. ",
    date: "2020-01-02",
    createdAt: new Date().toISOString(),
    imageUrl: "https://picsum.photos/200/300",
    payments: [],
  },
  {
    id: "3",
    title: "Event 3",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris posuere nunc vel est placerat consequat. Pellentesque malesuada pharetra risus. ",
    date: "2020-01-03",
    createdAt: new Date().toISOString(),
    imageUrl: "https://picsum.photos/200/300",
    payments: [],
  },
  {
    id: "4",
    title: "Event 4",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris posuere nunc vel est placerat consequat. Pellentesque malesuada pharetra risus. ",
    date: "2020-01-04",
    createdAt: new Date().toISOString(),
    imageUrl: "https://picsum.photos/20/300",
    payments: [],
  },
  {
    id: "5",
    title: "Event 5",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris posuere nunc vel est placerat consequat. Pellentesque malesuada pharetra risus. ",
    date: "2020-01-05",
    createdAt: new Date().toISOString(),
    imageUrl: "https://picsum.photos/200/300",
    payments: [],
  },
];
