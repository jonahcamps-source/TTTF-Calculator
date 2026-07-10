import { getTimeDifference } from "./utils/timeDifference";
import { metAutomaticStandard } from "./utils/timeComparison";
import { useState } from "react";
import data2025 from "./data/2025.json";
import data2026 from "./data/2026.json";
import { getAgeGroup } from "./utils/ageCalculator";
import { timeToSeconds } from "./utils/timeConverter";
import { calculatePoints } from "./utils/pointsCalculator";

function App() {
  const [competitionYear, setCompetitionYear] =
    useState(2026);

  const [pointsModelYear, setPointsModelYear] =
  useState("2026");

  const [dob, setDob] =
    useState("");

  const [sex, setSex] =
    useState("male");

  const [eventTimes, setEventTimes] =
    useState({});

  const ageGroup = getAgeGroup( dob, competitionYear);

  const datasets = {
  2025: data2025,
  2026: data2026
};

const data =
  datasets[pointsModelYear];
  const events =
    data.ageGroups?.[ageGroup]?.[sex]?.events ||
    {};

    const eventPoints = {};

Object.entries(events).forEach(
  ([key, event]) => {
    const time =
      eventTimes[key];

    if (
      time &&
      event.equation &&
      event.factorOffset !==
        undefined
    ) {
      const seconds =
        timeToSeconds(time);

      const factor =
        seconds -
        event.factorOffset;

      eventPoints[key] =
        calculatePoints(
          factor,
          event.equation
            .coefficients
        );
    }
  }
);
let triathlonTotal = 0;
let aquathlonTotal = 0;

const thresholds =
  data.ageGroups?.[ageGroup]?.[sex]
    ?.considerationThresholds;

const triathlonThreshold =
  thresholds?.triathlon || 0;

const aquathlonThreshold =
  thresholds?.aquathlon || 0;

const triathlonEvent =
  events.triathlon;

const aquathlonEvent =
  events.aquathlon;

const triathlonAutomaticAchieved =
  triathlonEvent &&
  metAutomaticStandard(
    eventTimes.triathlon,
    triathlonEvent
      .automaticQualifyingTime
  );

const aquathlonAutomaticAchieved =
  aquathlonEvent &&
  metAutomaticStandard(
    eventTimes.aquathlon,
    aquathlonEvent
      .automaticQualifyingTime
  );

const hasEnteredResults =
  Object.keys(eventPoints).length > 0;

const summaryRows = Object.entries(events)
  .filter(([key]) => eventTimes[key])
  .map(([key, event]) => {
    const seconds =
      timeToSeconds(
        eventTimes[key]
      );

    const factor =
      seconds -
      event.factorOffset;

    const points =
      calculatePoints(
        factor,
        event.equation.coefficients
      );

    return {
  event: event.name,
  time: eventTimes[key],
  standard: event.standardTime,
  difference: getTimeDifference(
    eventTimes[key],
    event.standardTime
  ),
  points
};
  });


if (ageGroup) {
  const scoreRule =
    data.scoreRules[
      ageGroup
    ];

  if (scoreRule) {
    triathlonTotal =
      scoreRule.triathlonTotal.reduce(
        (sum, eventKey) =>
          sum +
          (eventPoints[
            eventKey
          ] || 0),
        0
      );

    aquathlonTotal =
      scoreRule.aquathlonTotal.reduce(
        (sum, eventKey) =>
          sum +
          (eventPoints[
            eventKey
          ] || 0),
        0
      );
  }
}
  
  const handleTimeChange = (
  eventKey,
  value
) => {
  setEventTimes((prev) => ({
    ...prev,
    [eventKey]: value

  }));
};

  return (
    <div
      style={{
        maxWidth: "900px",
        margin: "0 auto",
        padding: "20px",
        fontFamily: "Arial"
      }}
    >
      <div
  style={{
    padding: "20px",
    marginBottom: "20px",
    textAlign: "center"
  }}
>
  <h1
  style={{
    fontSize: "2.4rem",
    textAlign: "center",
    lineHeight: "1.1",
    margin: "0 0 15px 0"
  }}
>
  CARIFTA Triathlon & Aquathlon
  <br />
  Calculator
</h1>

  <p>
    Enter the athlete's fastest
    performance from sanctioned
    TTTF events for each discipline.
  </p>

  <p>
    If multiple performances exist,
    only the athlete's fastest
    performance should be entered.
  </p>
  <div
  style={{
    border: "2px dashed #888",
    borderRadius: "12px",
    padding: "15px",
    marginTop: "20px",
    textAlign: "center"
  }}
>
  <div
    style={{
      fontSize: "0.85rem",
      opacity: 0.7,
      marginBottom: "5px"
    }}
  >
    OFFICIAL PARTNER
  </div>

  <div
    style={{
      fontSize: "1.3rem",
      fontWeight: "bold"
    }}
  >
    Advertise Here
  </div>

  <div
    style={{
      marginTop: "8px",
      fontSize: "0.9rem"
    }}
  >
    Reach athletes, parents, coaches and
    sporting organizations across Trinidad & Tobago.
  </div>

  <div
    style={{
      marginTop: "10px",
      fontWeight: "bold"
    }}
  >
    Contact us for sponsorship opportunities
  </div>
</div>
</div>

      <hr />
<div
  style={{
    border: "1px solid #444",
    borderRadius: "12px",
    padding: "20px",
    marginBottom: "20px"
  }}
>
  <h2
    style={{
      textAlign: "center",
      marginBottom: "20px"
    }}
  >
    Athlete Information
  </h2>

  <div
    style={{
      display: "grid",
      gridTemplateColumns:
        "repeat(auto-fit, minmax(180px, 1fr))",
      gap: "20px",
      alignItems: "end"
    }}
  >
    <div>
      <label>Competition Year</label>
      <br />

      <select
        value={competitionYear}
        onChange={(e) =>
          setCompetitionYear(
            Number(e.target.value)
          )
        }
      >
        <option value={2026}>2026</option>
        <option value={2027}>2027</option>
        <option value={2028}>2028</option>
      </select>
    </div>

    <div>
      <label>Date of Birth</label>
      <br />

      <input
        type="date"
        value={dob}
        onChange={(e) =>
          setDob(e.target.value)
        }
      />
    </div>

    <div>
      <label>Sex</label>
      <br />

      <select
        value={sex}
        onChange={(e) =>
          setSex(e.target.value)
        }
      >
        <option value="male">
          Male
        </option>

        <option value="female">
          Female
        </option>
      </select>
    </div>

    <div>
      <label>Age Group</label>
      <br />

      <div
      
        style={{
          marginTop: "8px",
          backgroundColor: "#14532d",
          color: "#fff",
          padding: "8px 12px",
          borderRadius: "999px",
          display: "inline-block",
          fontWeight: "bold"
        }}
      >
        {ageGroup || "-"}
      </div>
    </div>
  </div>
</div>
<div>
  <label>
    Points Model Year
  </label>

  <br />

  <select
    value={pointsModelYear}
    onChange={(e) =>
      setPointsModelYear(
        e.target.value
      )
    }
  >
    <option value="2025">
      2025
    </option>

    <option value="2026">
      2026
    </option>

  </select>
</div>
      <hr />

      <h2>Eligible Events</h2>

      <p
  style={{
    textAlign: "center",
    opacity: 0.7
  }}
>
  Points Model: {pointsModelYear}
</p>

      {Object.keys(events).length >
      0 ? (
        <div
          style={{
  display: "grid",
  gridTemplateColumns:
    "repeat(auto-fit, minmax(280px, 1fr))",
  gap: "20px"
}}
        >
          {Object.entries(
            events
          ).map(
            ([key, event]) => {
              const time =
                eventTimes[key] ||
                "";

              let points =
                null;

              if (time && event.equation) {
              const seconds =
  timeToSeconds(time);

const factor =
  seconds -
  event.factorOffset;

points =
  calculatePoints(
    factor,
    event.equation.coefficients
  );
``
}

              return (
  <div
    key={key}
    style={{
      border: "1px solid #444",
      borderRadius: "10px",
      padding: "15px",
          boxShadow:
        "0 2px 4px rgba(0,0,0,0.3)"
    }}
  >
    <h4
      style={{
        marginTop: 0,
        marginBottom: "10px",
        color: "white"
      }}
    >
      {event.name}</h4>
      <p
  style={{
    color: "#aaa",
    marginTop: 0,
    marginBottom: "10px"
  }}
>
  Standard: {event.standardTime}
</p>

    <input
      type="text"
      placeholder="hh:mm:ss"
      value={time}
      onChange={(e) =>
        handleTimeChange(
          key,
          e.target.value
        )
      }
      style={{
        padding: "8px",
        width: "200px",
        borderRadius: "6px"
      }}
    />
    {time && (
  <>
    <div
      style={{
        marginTop: "8px"
      }}
    >
      Athlete: {time}
    </div>

    <div
      style={{
        color:
          timeToSeconds(time) <=
          timeToSeconds(
            event.standardTime
          )
            ? "lightgreen"
            : "tomato"
      }}
    >
      Difference:{" "}
      {getTimeDifference(
        time,
        event.standardTime
      )}
    </div>
  </>
)}

    {points !== null && (
      <div
        style={{
          marginTop: "10px",
          color: "#4ade80",
          fontWeight: "bold"
        }}
      >
        Points: {points}
      </div>
    )}
  </div>
);
            }
          )}
        </div>
      ) : (
        <p>
          Select athlete
          information to view
          events.
        </p>
      )}
{hasEnteredResults && (
  <>
    <hr />

{summaryRows.length > 0 && (
  <>
    <hr />

    <h2>
      Event Score Summary
    </h2>

    <p
  style={{
    textAlign: "center",
    opacity: 0.7
  }}
>
  Points Model: {pointsModelYear}
</p>

    <table
      style={{
        width: "100%",
        borderCollapse:
          "collapse",
        marginTop: "15px"
      }}
    >
      <thead>
        <tr>
          <th
            style={{
              textAlign: "left",
              padding: "10px"
            }}
          >
            Event
          </th>

          <th
            style={{
              textAlign: "center",
              padding: "10px"
            }}
          >
            Athlete
            </th>

            <th
            style={{
              textAlign: "center",
              padding: "10px"
            }}
          >
            Standard
            </th>

            <th
            style={{
              textAlign: "center",
              padding: "10px"
            }}
          >
          
            Difference
          </th>

          <th
            style={{
              textAlign: "center",
              padding: "10px"
            }}
          >
            Points
          </th>
        </tr>
      </thead>

      <tbody>
        {summaryRows.map(
          (
            row,
            index
          ) => (
            <tr
              key={index}
            >
              <td
                style={{
                  padding:
                    "10px"
                }}
              >
                {row.event}
              </td>

              <td
                style={{
                  textAlign:
                    "center",
                  padding:
                    "10px"
                }}
              >
             
  {row.time}
</td>

<td
  style={{
    textAlign: "center"
  }}
>
  {row.standard}
</td>

<td
  style={{
    textAlign: "center",
    color:
      row.difference.startsWith("-")
        ? "lightgreen"
        : "tomato",
    fontWeight: "bold"
  }}
>
  {row.difference}
</td>

<td
  style={{
    textAlign: "center",
    color: "#4ade80",
    fontWeight: "bold"
  }}
>
  {row.points}
</td>
            </tr>
          )
        )}
      </tbody>
      <tr>
  <td
    colSpan="4"
    style={{
      fontWeight: "bold",
      paddingTop: "15px"
    }}
  >
    TRIATHLON TOTAL
  </td>

  <td
    style={{
      textAlign: "center",
      fontWeight: "bold",
      color: "#4ade80"
    }}
  >
    {triathlonTotal}
  </td>
</tr>

<tr>
  <td
    colSpan="4"
    style={{
      fontWeight: "bold"
    }}
  >
    AQUATHLON TOTAL
  </td>

  <td
    style={{
      textAlign: "center",
      fontWeight: "bold",
      color: "#4ade80"
    }}
  >
    {aquathlonTotal}
  </td>
</tr>
    </table>
  </>
)}

    <h2>Assessment</h2>

    <div
  style={{
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(350px, 1fr))",
    gap: "20px",
    marginTop: "20px"
  }}
>
      <div
        style={{
          border: "1px solid #444",
          borderRadius: "10px",
          padding: "15px",
          marginBottom: "20px"
        }}
      >
        <h3>Triathlon Pathway</h3>

        <p>
          Total Score: {triathlonTotal}
        </p>

        <p>
          Consideration Threshold: {triathlonThreshold}
        </p>

        <p
          style={{
            color:
              triathlonTotal >=
              triathlonThreshold
                ? "lightgreen"
                : "tomato",
            fontWeight: "bold"
          }}
        >
          {triathlonTotal >=
          triathlonThreshold
            ? "✅ Consideration Standard Achieved"
            : "❌ Consideration Standard Not Achieved"}
        </p>

        <p>
          Automatic Standard:{" "}
          {
            triathlonEvent?.automaticQualifyingTime
          }
        </p>

        <p>
          Athlete Time:{" "}
          {eventTimes.triathlon || "-"}
        </p>

        <p
          style={{
            color:
              triathlonAutomaticAchieved
                ? "lightgreen"
                : "tomato",
            fontWeight: "bold"
          }}
        >
          {triathlonAutomaticAchieved
            ? "✅ Automatic Qualification Standard Achieved"
            : "❌ Automatic Qualification Standard Not Achieved"}
        </p>

<p
  style={{
    textAlign: "center",
    opacity: 0.7
  }}
>
  Points Model: {pointsModelYear}
</p>

      </div>

      <div
        style={{
          border: "1px solid #444",
          borderRadius: "10px",
          padding: "15px"
        }}
      >
        <h3>Aquathlon Pathway</h3>

        <p>
          Total Score: {aquathlonTotal}
        </p>

        <p>
          Consideration Threshold: {aquathlonThreshold}
        </p>

        <p
          style={{
            color:
              aquathlonTotal >=
              aquathlonThreshold
                ? "lightgreen"
                : "tomato",
            fontWeight: "bold"
          }}
        >
          {aquathlonTotal >=
          aquathlonThreshold
            ? "✅ Consideration Standard Achieved"
            : "❌ Consideration Standard Not Achieved"}
        </p>

        <p>
          Automatic Standard:{" "}
          {
            aquathlonEvent?.automaticQualifyingTime
          }
        </p>

        <p>
          Athlete Time:{" "}
          {eventTimes.aquathlon || "-"}
        </p>

        <p
          style={{
            color:
              aquathlonAutomaticAchieved
                ? "lightgreen"
                : "tomato",
            fontWeight: "bold"
          }}
        >
          {aquathlonAutomaticAchieved
            ? "✅ Automatic Qualification Standard Achieved"
            : "❌ Automatic Qualification Standard Not Achieved"}
        </p>

        <p
  style={{
    textAlign: "center",
    opacity: 0.7
  }}
>
  Points Model: {pointsModelYear}
</p>
                       
      </div>
    </div>
  </>
)}

<button
  onClick={() => {
    setDob("");
    setSex("male");
    setEventTimes({});
  }}
  style={{
    marginTop: "20px",
    padding: "10px 15px",
    borderRadius: "8px",
    cursor: "pointer"
  }}
>
  Reset Calculator
</button>
<hr />

<h2>Important Information</h2>

<ul>
  {data.disclaimers.map(
    (item, index) => (
      <li key={index}>
        {item}
      </li>
    )
  )}
</ul>
<p
  style={{
    textAlign: "center",
    marginTop: "40px",
    color: "#8b0707"
  }}
>
  For demonstration purposes only. Not for official use.
  No information provided by this calculator should be used for official selection purposes. Please refer to the official CARIFTA Triathlon and Aquathlon Selection Policy for official information.
</p>
<p
  style={{
    textAlign: "center",
    opacity: 0.7
  }}
>
  CARIFTA Multisport Calculator
  | Points Model {pointsModelYear}
</p>
</div>

);
}

export default App;