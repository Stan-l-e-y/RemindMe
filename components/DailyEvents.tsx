export default function DailyEvents({date} : {date: Date}) {
  //TODO: fetch api events for this date
  return (
    <>
      <div></div>
    </>
  );
}

const events = [
  {
    id: 4,
    name: "John's Birthday",
    type: 'BIRTHDAY',
    description: '',
    startDate: '2023/01/28',
  },
  {
    id: 3,
    name: 'Business meeting',
    type: 'MEETING',
    description: 'corporate meeting',
    startDate: '2023/01/29',
  },
  {
    id: 5,
    name: 'Uncles wedding',
    type: 'CELEBRATION',
    description: '',
    startDate: '2023/01/31',
  },
];
