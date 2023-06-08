import { useState } from "react";
import { subMonths, addMonths } from "date-fns";

const Calendar = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const goToPreviousMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  const goToNextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  const buildCalendar = () => {
    const firstDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
    const lastDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);
    const tbody_Calendar = document.querySelector(".Calendar > tbody");
    document.getElementById("calYear").innerText = currentMonth.getFullYear();
    document.getElementById("calMonth").innerText = leftPad(currentMonth.getMonth() + 1);

    while (tbody_Calendar.rows.length > 0) {
      tbody_Calendar.deleteRow(tbody_Calendar.rows.length - 1);
    }

    let nowRow = tbody_Calendar.insertRow();

    for (let j = 0; j < firstDate.getDay(); j++) {
      let nowColumn = nowRow.insertCell();
    }

    for (let nowDay = firstDate; nowDay <= lastDate; nowDay.setDate(nowDay.getDate() + 1)) {
      let nowColumn = nowRow.insertCell();

      let newDIV = document.createElement("p");
      newDIV.innerHTML = leftPad(nowDay.getDate());
      nowColumn.appendChild(newDIV);

      if (nowDay.getDay() === 6) {
        nowRow = tbody_Calendar.insertRow();
      }

      if (nowDay < today) {
        newDIV.className = "pastDay";
      } else if (nowDay.getFullYear() === today.getFullYear() && nowDay.getMonth() === today.getMonth() && nowDay.getDate() === today.getDate()) {
        newDIV.className = "today";
        newDIV.onclick = function () {
          choiceDate(this);
        };
      } else {
        newDIV.className = "futureDay";
        newDIV.onclick = function () {
          choiceDate(this);
        };
      }
    }
  };

  const choiceDate = (newDIV) => {
    const choiceDay = document.getElementsByClassName("choiceDay")[0];
    if (choiceDay) {
      choiceDay.classList.remove("choiceDay");
    }
    newDIV.classList.add("choiceDay");
  };

  const leftPad = (value) => {
    if (value < 10) {
      value = "0" + value;
    }
    return value;
  };

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return (
    <div className="bg-white rounded-lg p-4 max-w-md mx-auto shadow-lg">
      <table className="Calendar">
        <thead>
          <tr>
            <td onClick={goToPreviousMonth} className="cursor-pointer">
              &#60;
            </td>
            <td colSpan="5">
              <span id="calYear">{currentMonth.getFullYear()}</span>년
              <span id="calMonth">{leftPad(currentMonth.getMonth() + 1)}</span>월
            </td>
            <td onClick={goToNextMonth} className="cursor-pointer">
              &#62;
            </td>
          </tr>
          <tr>
            <td>일</td>
            <td>월</td>
            <td>화</td>
            <td>수</td>
            <td>목</td>
            <td>금</td>
            <td>토</td>
          </tr>
        </thead>
        <tbody></tbody>
      </table>
    </div>
  );
};

export default Calendar;
