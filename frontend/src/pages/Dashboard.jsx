import React from 'react';
import {
  Activity,
  BatteryCharging,
  CloudSun,
  Droplets,
  Power,
  Sun,
  Zap
} from 'lucide-react';

import Card from '../components/Card';
import CardHeader from '../components/CardHeader';
import Metric from '../components/Metric';
import ActivityItem from '../components/ActivityItem';

export default function Dashboard({
   minMoisture = 40,
  maxMoisture = 65,
  moisture,
  temperature,
  humidity,
  waterLevel,
  weather,
  waterUsed,
  waterSaved,
  waterSavingPercent,
  battery,
  solarPower,
  pumpOn,
  autoMode,
  status,
  lastUpdate,
  simulateMoisture,
  simulateWeather,
  rainSkipCount,
}) {
  return (
    <>
      {/* WELCOME */}
      <div className="welcome">

        <div>
          <span className="eyebrow">
            HỆ THỐNG TƯỚI THÔNG MINH
          </span>


          {/* <p>
            Theo dõi khu vực trồng cây và điều khiển tưới
            theo thời gian thực
          </p> */}

          {/* <small>
            Cập nhật lần cuối:{' '}
            {lastUpdate || 'Đang chờ dữ liệu...'}
          </small> */}
        </div>

<div className="dashboard-actions">

  <button
    className="secondary"
    onClick={simulateMoisture}
  >
    <Activity size={18} />
    Cập nhật cảm biến
  </button>

  <button
    className="secondary"
    onClick={simulateWeather}
  >
    <CloudSun size={18} />
    Cập nhật thời tiết
  </button>

</div>

      </div>

      {/* METRICS */}
      <div className="metrics">

        <Metric
          icon={Droplets}
          label="Độ ẩm đất"
          value={moisture}
          unit="%"
          color="#2987c7"
        />

        <Metric
          icon={CloudSun}
          label="Nhiệt độ"
          value={temperature}
          unit="°C"
          color="#e28a27"
        />

        <Metric
          icon={Droplets}
          label="Độ ẩm không khí"
          value={humidity}
          unit="%"
          color="#2987c7"
        />

        <Metric
          icon={Power}
          label="Máy bơm"
          value={pumpOn ? 'ĐANG BẬT' : 'ĐANG TẮT'}
          color={pumpOn ? '#23924e' : '#66746c'}
        />

      </div>
      <div className="grid-2">

  {/* THỜI TIẾT */}
  <Card>
    <CardHeader
      title="Dữ liệu thời tiết"
      icon={CloudSun}
      // subtitle="Điều kiện thời tiết hiện tại"
    />

    <div className="energy-big">
      <strong>
        {weather?.temperature ?? temperature}°C
      </strong>

      <span>
        {weather?.condition ?? 'Đang cập nhật'}
      </span>
    </div>

    {/* <div className="mini-row">
      <span>
        <Droplets size={15} />
        Độ ẩm không khí
      </span>

      <strong>
        {weather?.humidity ?? humidity}%
      </strong>
    </div> */}

    <div className="mini-row">
      <span>
        <CloudSun size={15} />
        Trạng thái
      </span>

      <strong>
        {weather?.rainExpected
          ? 'Có khả năng mưa'
          : 'Không có mưa'}
      </strong>
    </div>
  </Card>


  {/* DỰ BÁO MƯA */}
  <Card>
    <CardHeader
      title="Dự báo mưa"
      icon={CloudSun}
      // subtitle="Khả năng mưa trong thời gian tới"
    />

    <div className="energy-big">
      <strong>
        {weather?.rainProbability ?? 0}%
      </strong>

      <span>
        Khả năng xuất hiện mưa
      </span>
    </div>

    <div className="progress">
      <span
        style={{
          width: `${Math.min(
            Math.max(
              weather?.rainProbability ?? 0,
              0
            ),
            100
          )}%`
        }}
      />
    </div>

    <div className="mini-row">
      <span>
        <Droplets size={15} />
        Dự báo
      </span>

      <strong>
        {weather?.rainProbability >= 60
          ? 'Có mưa'
          : 'Ít khả năng mưa'}
      </strong>
    </div>
  </Card>

</div>

      {/* GRID */}
      <div className="grid-2">


        {/* MỰC NƯỚC */}
        {/* <Card>

          <CardHeader
            title="Mực nước"
            icon={Droplets}
          />

          <div className="energy-big">

            <strong>
              {waterLevel}%
            </strong>

            <span>
              Mức nước hiện tại
            </span>

          </div>

          <div className="progress">
            <span
              style={{
                width: `${Math.min(
                  Math.max(waterLevel, 0),
                  100
                )}%`
              }}
            />
          </div>

          <div className="mini-row">
            <span>
              <Droplets size={15} />
              Trạng thái
            </span>

            <strong>
              {waterLevel >= 30
                ? 'Đủ nước'
                : 'Sắp hết nước'}
            </strong>
          </div>

        </Card> */}

        {/* TRẠNG THÁI */}
        <Card>

          <CardHeader
            title="Trạng thái hệ thống"
            icon={Activity}
          />

          <div className="system-state">

            <div className={`state-circle ${status.type}`}>
              <Droplets size={30} />

              <strong>
                {moisture}%
              </strong>
            </div>

            <div>

              <h3>
                {status.text}
              </h3>

              <p>
                Ngưỡng tưới: {minMoisture}% – {maxMoisture}%
              </p>

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

            </div>

          </div>

        </Card>

        {/* NĂNG LƯỢNG */}
        <Card>

          <CardHeader
            title="Năng lượng hôm nay"
            icon={Zap}
          />

          <div className="energy-big">

<strong>
  {solarPower > 0
    ? (solarPower / 1000).toFixed(2)
    : '6.32'} <small>kWh</small>
</strong>

            <span>
              Đã thu được từ pin mặt trời
            </span>

          </div>

          {/* <div className="mini-row">

            <span>
              <Sun size={16} />
              Mặt trời
            </span>

            <strong>
              {solarPower} W
            </strong>

          </div> */}

          <div className="mini-row">

            <span>
              <BatteryCharging size={16} />
              Pin
            </span>

            <strong>
              {battery}%
            </strong>

          </div>

        </Card>

        {/* MÁY BƠM */}
        <Card>

          <CardHeader
            title="Máy bơm"
            icon={Power}
          />

          <div className="energy-big">

            <strong>
              {pumpOn ? 'ĐANG BẬT' : 'ĐANG TẮT'}
            </strong>

            <span>
              {autoMode
                ? 'Đang hoạt động ở chế độ tự động'
                : 'Đang hoạt động ở chế độ thủ công'}
            </span>

          </div>

          <div className="mini-row">

            <span>
              <Power size={15} />
              Trạng thái
            </span>

            <strong>
              {pumpOn ? 'ON' : 'OFF'}
            </strong>

          </div>

          <div className="mini-row">

            <span>
              Chế độ
            </span>

            <strong>
              {autoMode ? 'Tự động' : 'Thủ công'}
            </strong>

          </div>

        </Card>

              {/* GRID HOẠT ĐỘNG GẦN ĐÂY */}
        <Card>
          <CardHeader
            title="Hoạt động gần đây"
            icon={Activity}
          />

          <div className="activity-list">
            <ActivityItem
              icon={Droplets}
              title=" Cập nhật độ ẩm đất"
              description={`Độ ẩm hiện tại: ${moisture}%`}
              time="Vừa xong"
            />

            <ActivityItem
              icon={Power}
              title={
                pumpOn
                  ? ' Máy bơm đang hoạt động'
                  : ' Máy bơm đang tắt'
              }
              description={
                autoMode
                  ? 'Chế độ tự động'
                  : 'Chế độ thủ công'
              }
              time="Trạng thái hiện tại"
            />

            <ActivityItem
              icon={Activity}
              title=" Kết nối ESP32"
              description="Thiết bị đang kết nối ổn định"
              time="Online"
            />
          </div>
        </Card>

      </div>

      

 {/* TIẾT KIỆM NƯỚC */}
{/* <Card>
  <CardHeader
    title="Tiết kiệm nước"
    icon={Droplets}
    subtitle="Hiệu quả sử dụng nước của hệ thống"
  />

  <div className="water-saving-grid">

    <div className="water-saving-item">
      <span>Lượng nước đã dùng: </span>
      <strong>
        {waterUsed} L
      </strong>
    </div>

    <div className="water-saving-item">
      <span>Lượng nước tiết kiệm: </span>
      <strong>
        {waterSaved} L
      </strong>
    </div>

    <div className="water-saving-item">
      <span>Tỷ lệ tiết kiệm: </span>
      <strong>
        {waterSavingPercent}%
      </strong>
    </div>

  </div>

  <div className="progress">
    <span
      style={{
        width: `${Math.min(
          Math.max(waterSavingPercent, 0),
          100
        )}%`
      }}
    />
  </div>

  <div className="mini-row">
    <span>
      <Droplets size={15} />
      Hiệu quả
    </span>

    <strong>
      {waterSavingPercent >= 20
        ? 'Tiết kiệm tốt'
        : 'Đang theo dõi'}
    </strong>
  </div>
</Card> */}

    </>
  );
}