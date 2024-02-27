import {Input} from "@/components/ui/input";
import React, {useEffect} from "react";
import styles from "./time-picker.module.scss";
import {inputObjHandler} from "@/lib/handlers";
import {pad} from "@/lib/utils";
import {useAtom} from "jotai";
import {endTimeAtom, startTimeAtom} from "@/atoms/posting-form";

type TimePickerProps = {
  onSelect: Function;
};

export function TimeRangePicker(props: TimePickerProps) {
  const [startTime, setStartTime] = useAtom(startTimeAtom);
  const [endTime, setEndTime] = useAtom(endTimeAtom);

  function hourQualifier(val: string) {
    if (val.length > 2) return false;
    if (!val) return true;
    const n = parseInt(val);
    return n >= 0 && n <= 12;
  }

  function minuteQualifier(val: string) {
    if (val.length > 2) return false;
    if (!val) return true;
    const n = parseInt(val);
    return n >= 0 && n <= 59;
  }

  function periodHandler(e: React.KeyboardEvent<HTMLInputElement>, targetName: string, startOrEnd: string) {
    let fn;
    if (startOrEnd === "start") {
      fn = setStartTime;
    } else {
      fn = setEndTime;
    }
    if (e.key === "a" || e.key === "A") {
      fn((prev) => ({...prev, [targetName]: "AM"}));
    }
    if (e.key === "p" || e.key === "P") {
      fn((prev) => ({...prev, [targetName]: "PM"}));
    }
    endTimeCallback()
  }

  function endTimeCallback() {
    console.log("endTimeCallback")
    if (endTime.hour !== "" || endTime.minute !== "" || endTime.period !== "") return;
    if (startTime.hour === "" || startTime.minute === "" || startTime.period === "") return;
    if (startTime.hour && startTime.minute && startTime.period) {
      const newTime = addAnHour(startTime)
      setEndTime(prev => {
        return {
          ...prev,
          hour: pad(newTime.hour, 2),
          minute: pad(newTime.minute, 2),
          period: startTime.period === "PM" ? "PM" : "AM",
        }
      })
    }
  }

  function addAnHour(timeObj: { hour: string, minute: string, period: string }) {
    // convert to 24 hour time
    let hour = parseInt(timeObj.hour);
    if (timeObj.period === "PM") {
      hour += 12;
    }
    if (hour === 24) {
      hour = 0;
    }
    hour += 1;
    if (hour === 24) {
      hour = 0;
    }
    // convert back to 12 hour time
    let period = "AM";
    if (hour >= 12) {
      period = "PM";
    }
    if (hour > 12) {
      hour -= 12;
    }
    return {
      hour: hour.toString(),
      minute: timeObj.minute,
      period: period,
    }
  }

  useEffect(() => {
    props.onSelect({
      startTime,
      endTime
    });
  }, [startTime, endTime]);

  return (
    <div className={styles.wrapper}>
      <label className={styles.label}>Start time:</label>
      <div className={styles.pickerContainer}>
        <Input
          name="hour"
          placeholder="08"
          value={startTime.hour}
          onChange={(e) =>
            inputObjHandler(e, setStartTime, startTime, {
              type: "number",
              qualifier: hourQualifier,
              callback: endTimeCallback,
            })
          }
        />
        <Input
          name="minute"
          placeholder="30"
          value={startTime.minute}
          onChange={(e) =>
            inputObjHandler(e, setStartTime, startTime, {
              type: "number",
              qualifier: minuteQualifier,
              callback: endTimeCallback
            })
          }
        />
        <Input
          name="period"
          placeholder="AM"
          value={startTime.period}
          onKeyDown={(e) => periodHandler(e, "period", "start")}
        />
      </div>
      <label className={styles.label}>End time:</label>
      <div className={styles.pickerContainer}>
        <Input
          name="hour"
          placeholder="08"
          value={endTime.hour}
          onChange={(e) =>
            inputObjHandler(e, setEndTime, endTime, {
              type: "number",
              qualifier: hourQualifier,
            })
          }
        />
        <Input
          name="minute"
          placeholder="30"
          value={endTime.minute}
          onChange={(e) =>
            inputObjHandler(e, setEndTime, endTime, {
              type: "number",
              qualifier: minuteQualifier,
            })
          }
        />
        <Input
          name="period"
          placeholder="AM"
          value={endTime.period}
          onKeyDown={(e) => periodHandler(e, "period", "end")}
        />
      </div>
    </div>
  );
}
