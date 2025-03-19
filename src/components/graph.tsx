import { BASEURL } from "@/utils/constant";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, LineChart, Line, CartesianGrid, ResponsiveContainer } from "recharts";

type Checkin = {
  createdAt: string;
  mood: "HAPPY" | "SAD" | "NEUTRAL";
  energyLevel: "LOW" | "MEDIUM" | "HIGH";
};

const checkins: Checkin[] = [
  { createdAt: "2025-03-13", mood: "HAPPY", energyLevel: "HIGH" },
  { createdAt: "2025-03-14", mood: "SAD", energyLevel: "LOW" },
  { createdAt: "2025-03-15", mood: "NEUTRAL", energyLevel: "MEDIUM" },
  { createdAt: "2025-03-16", mood: "HAPPY", energyLevel: "HIGH" },
  { createdAt: "2025-03-17", mood: "HAPPY", energyLevel: "MEDIUM" },
  { createdAt: "2025-03-18", mood: "SAD", energyLevel: "LOW" },
  { createdAt: "2025-03-19", mood: "HAPPY", energyLevel: "HIGH" },
];



const MoodEnergyCharts: React.FC = () => {
  const QueryData = useQuery({
    queryKey: ["data"],
    queryFn: async () => {
      const resp = await axios.get(`${BASEURL}/checkin/last7`, {
        headers: {
          Authorization: ` ${localStorage.getItem("token")}`
        }
      })
      return resp.data
    }
  })
  if (QueryData.isLoading) return <p>Loading...</p>
  if (QueryData.isError) return <p>Error</p>
  if (QueryData.data) {
    const moodCounts: Record<string, number> = QueryData.data.data.reduce((acc: any, { mood }: any) => {
      acc[mood] = (acc[mood] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const moodData = Object.keys(moodCounts).map((mood) => ({ mood, count: moodCounts[mood] }));

    const energyLevelsMap: Record<string, number> = { LOW: 1, MEDIUM: 2, HIGH: 3 };
    const energyData = checkins.map(({ createdAt, energyLevel }) => ({ createdAt, level: energyLevelsMap[energyLevel] }));
    return (

      <div className="flex justify-around px-5 items-center  w-full">
        <div className="w-2/5  bg-gray-100 p-5 rounded-lg">
          <h2 className="text-xl font-bold mb-2">Mood Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={moodData}>
              <XAxis dataKey="mood" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="w-2/5  bg-gray-100 p-5 rounded-lg">
          <h2 className="text-xl font-bold mb-2">Energy Level Trend</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={energyData}>
              <XAxis dataKey="date" />
              <YAxis domain={[1, 3]} ticks={[1, 2, 3]} tickFormatter={(val) => (val === 1 ? "LOW" : val === 2 ? "MEDIUM" : "HIGH")} />
              <CartesianGrid strokeDasharray="3 3" />
              <Tooltip />
              <Line type="monotone" dataKey="level" stroke="#82ca9d" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  };
}

export default MoodEnergyCharts;