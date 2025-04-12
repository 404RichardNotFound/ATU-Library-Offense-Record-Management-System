import { Calendar } from 'antd';
import type { CalendarProps } from 'antd';
import type { Dayjs } from 'dayjs';

const Calender = () => {
  const onPanelChange = (value: Dayjs, mode: CalendarProps<Dayjs>['mode']) => {
    console.log(value.format('YYYY-MM-DD'), mode);
  };

  return (
    <div className="p-3 border-[1px] rounded-md border-neutral-300">
      <Calendar onPanelChange={onPanelChange} />
    </div>
  );
};

export default Calender;
