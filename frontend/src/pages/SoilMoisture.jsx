import React from 'react';
import { Activity, Droplets } from 'lucide-react';

import Card from '../components/Card';
import CardHeader from '../components/CardHeader';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';

export default function SoilMoisture({
  moisture,
  soil1,
  soil2,
  history,
  status,
  onRefresh,
  minMoisture = 40,
  maxMoisture = 65,
}) {
  return (
    <>
      {/* TIÊU ĐỀ */}


      {/* ĐỘ ẨM HIỆN TẠI + BIỂU ĐỒ */}
      <section className="monitor-top">

        {/* ĐỘ ẨM HIỆN TẠI */}
        <Card className="current-moisture">

          <Droplets
            size={30}
            color="#2987c7"
          />

          <span>
            Độ ẩm hiện tại
          </span>

          <strong>
            {moisture}
            <small>%</small>
          </strong>

          <div className={`badge ${status.type}`}>
            {status.text}
          </div>

        </Card>

        {/* BIỂU ĐỒ */}
        <Card className="chart-card">

          <CardHeader
            title="Lịch sử độ ẩm"
            icon={Activity}
            // subtitle="Theo dõi biến động độ ẩm trong ngày"
          />

<div style={{ width: '100%', height: 280 }}>
  <ResponsiveContainer width="100%" height="100%">
    <BarChart
      data={history}
      margin={{ top: 10, right: 15, left: 0, bottom: 10 }}
    >
      <CartesianGrid strokeDasharray="3 3" />

      <XAxis
        dataKey="time"
        tick={{ fontSize: 11 }}
        label={{
          value: 'Thời gian',
          position: 'insideBottom',
          offset: -5,
        }}
      />

      <YAxis
        domain={[0, 100]}
        ticks={[0, 20, 40, 60, 80, 100]}
        unit="%"
        tick={{ fontSize: 12 }}
        label={{
          value: 'Độ ẩm (%)',
          angle: -90,
          position: 'insideLeft',
        }}
      />

      <Tooltip
        formatter={(value) => [`${value}%`, 'Độ ẩm']}
        labelFormatter={(label) => `Thời gian: ${label}`}
      />

      <Bar
        dataKey="moisture"
        name="Độ ẩm"
        fill="#39A96B"
        radius={[5, 5, 0, 0]}
      />
    </BarChart>
  </ResponsiveContainer>
</div>

        </Card>

      </section>

      {/* THÔNG TIN */}
      <section
  className="grid-2"
  style={{ marginTop: '18px' }}
>

        <Card>

          <CardHeader
            title="Thông tin độ ẩm"
            icon={Droplets}
            // subtitle="Giá trị cảm biến hiện tại"
          />

        <div className="energy-big">

          <strong>
            {moisture}%
          </strong>

          <span>
            Độ ẩm đất trung bình
          </span>

        </div>

        <div className="mini-row">
          <span>
            Độ ẩm đất 1
          </span>

          <strong>
            {soil1}%
          </strong>
        </div>

        <div className="mini-row">
          <span>
            Độ ẩm đất 2
          </span>

          <strong>
            {soil2}%
          </strong>
        </div>

          <div className="mini-row">

            <span>
              Trạng thái
            </span>

            <strong>
              {status.text}
            </strong>

          </div>

          <div className="mini-row">

            <span>
              Ngưỡng bật bơm
            </span>

            <strong>
              &lt; {minMoisture}%
            </strong>

          </div>

          <div className="mini-row">

            <span>
              Ngưỡng tắt bơm
            </span>

            <strong>
              ≥ {maxMoisture}%
            </strong>

          </div>

        </Card>

        <Card>

          <CardHeader
            title="Đánh giá độ ẩm"
            icon={Activity}
            // subtitle="Tình trạng đất hiện tại"
          />

          <div className="rule-box">

            <span>
              Mức độ ẩm
            </span>

            <strong>
              {moisture}%
            </strong>

            <span>
              {moisture < minMoisture
                ? 'Đất đang khô, cần tưới nước'
                : moisture >= maxMoisture
                ? 'Đất đã đủ ẩm, không cần tưới'
                : 'Độ ẩm đang nằm trong vùng ổn định'}
            </span>

          </div>

          <div className="progress">

            <span
              style={{
                width: `${Math.min(
                  Math.max(moisture, 0),
                  100
                )}%`
              }}
            />

          </div>

        </Card>

      </section>

      {/* CẬP NHẬT CẢM BIẾN */}
      <button
        className="primary"
        onClick={onRefresh}
      >
        <Activity size={18} />
        Đọc lại cảm biến
      </button>
    </>
  );
}