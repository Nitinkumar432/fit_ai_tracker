import { useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const timeFrames = ["Week", "Month", "Year"] as const;

type TimeFrame = (typeof timeFrames)[number];

interface DataPoint {
  day: string;
  value: number;
}

const dataMap: Record<TimeFrame, DataPoint[]> = {
  Week: [
    { day: "Mon", value: 10 },
    { day: "Tue", value: 30 },
    { day: "Wed", value: 20 },
    { day: "Thu", value: 50 },
    { day: "Fri", value: 40 },
    { day: "Sat", value: 60 },
    { day: "Sun", value: 80 },
  ],
  Month: Array.from({ length: 30 }, (_, i) => ({
    day: `Day ${i + 1}`,
    value: Math.random() * 100,
  })),
  Year: Array.from({ length: 12 }, (_, i) => ({
    day: `Month ${i + 1}`,
    value: Math.random() * 500,
  })),
};

const Record: React.FC = () => {
  const [selectedTimeFrame, setSelectedTimeFrame] = useState<TimeFrame>("Week");

  const data = dataMap[selectedTimeFrame];

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg max-w-lg mx-auto text-center">
      <h2 className="text-xl font-bold mb-4">Record</h2>
      <div className="flex gap-2 justify-center mb-4">
        {timeFrames.map((frame) => (
          <button
            key={frame}
            className={`px-4 py-2 rounded-lg ${
              selectedTimeFrame === frame ? "bg-green-500 text-white" : "bg-gray-200"
            }`}
            onClick={() => setSelectedTimeFrame(frame)}
          >
            {frame}
          </button>
        ))}
      </div>
      <div className="mt-6 p-4 bg-gray-100 rounded-lg shadow-md">
        <h3 className="text-lg font-bold mb-2">Activity Progress</h3>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="value" stroke="#8884d8" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Record;
