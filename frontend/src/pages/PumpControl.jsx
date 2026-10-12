import React from 'react';
import {
  Power,
  Droplets,
  Activity,
  CloudSun,
  CheckCircle,
  XCircle,
  Clock,
  Thermometer,
  BatteryCharging,
  CloudRain
} from 'lucide-react';
import Card from '../components/Card';
import CardHeader from '../components/CardHeader';


export default function PumpControl({
  pumpOn,
  autoMode,
  setAutoMode,
  togglePump,
  moisture,
  temperature,
  battery,
  weather,
  currentCrop,
  simulateWeather
}) {
    const rainProbability = weather?.rainProbability ?? 0;

  const rainLikely = rainProbability >= 60;

  const irrigationDecision =
    moisture < 40
      ? rainLikely
        ? 'Không tưới'
        : 'Có thể tưới'
      : 'Không cần tưới';
      const soilIsDry =
  currentCrop &&
  moisture < currentCrop.minMoisture;

const temperatureIsSuitable =
  currentCrop &&
  weather.temperature >= currentCrop.minTemperature &&
  weather.temperature <= currentCrop.maxTemperature;

const rainIsLikely =
  weather.rainProbability >= 60;

const noRain =
  currentCrop &&
  (!currentCrop.skipRain || !rainIsLikely);

const currentTime =
  new Date().toTimeString().slice(0, 5);

const isTimeAllowed =
  currentCrop &&
  currentTime >= currentCrop.startTime &&
  currentTime <= currentCrop.endTime;

const batteryEnough =
  battery > 20;

const shouldWater =
  soilIsDry &&
  temperatureIsSuitable &&
  noRain &&
  isTimeAllowed &&
  batteryEnough;
  return (
    <>
      {/* Tiêu đề trang
      <section className="page-intro">
        <h2>Điều khiển bơm</h2>
        <p>
          Theo dõi và điều khiển hoạt động của máy bơm tưới nước
        </p>
      </section> */}

      {/* Khu vực điều khiển */}
      <section className="pump-layout">
        

        {/* Trạng thái máy bơm */}
        <Card className="pump-card">
          <CardHeader
            icon={Power}
            title="Trạng thái máy bơm"
            // subtitle="Trạng thái hoạt động hiện tại"
          />

          <div className={`pump-status ${pumpOn ? 'on' : ''}`}>
            <Power size={40} />
          </div>

          <span>Trạng thái hiện tại</span>

          <strong>
            {pumpOn ? 'Đang hoạt động' : 'Đang tắt'}
          </strong>

          <button
            className={`pump-button ${pumpOn ? 'danger' : ''}`}
            onClick={togglePump}
            disabled={autoMode}
          >
            <Power size={18} />

            {autoMode
              ? 'Chế độ tự động'
              : pumpOn
              ? 'Tắt máy bơm'
              : 'Bật máy bơm'}
          </button>

          <small>
            {autoMode
              ? 'Chuyển sang chế độ thủ công để điều khiển máy bơm'
              : 'Bạn đang điều khiển máy bơm thủ công'}
          </small>
        </Card>
<Card className="weather-decision-card">
  <CardHeader
    icon={Droplets}
    title="Quyết định tưới"
    // subtitle="Điều khiển dựa trên độ ẩm đất và dự báo mưa"
  />
  <div className="weather-update-row">
<button
  className="secondary"
  // onClick={simulateWeather}
  onClick={() => {
  console.log('🟢 ĐÃ BẤM NÚT CẬP NHẬT THỜI TIẾT');
  simulateWeather();
}}
>
  <CloudSun size={17} />
  Cập nhật khả năng mưa
</button>
</div>

  <div className="decision-box">

    <div className="mini-row">
      <span>
        <Droplets size={15} />
        Độ ẩm đất
      </span>

      <strong>
        {moisture}%
      </strong>
    </div>

    <div className="mini-row">
      <span>
        <Activity size={15} />
        Khả năng mưa
      </span>

      <strong>
        {rainProbability}%
      </strong>
    </div>
    <div className="progress">
  <span
    style={{
      width: `${Math.min(
        Math.max(rainProbability, 0),
        100
      )}%`
    }}
  />
</div>

    <div className="mini-row">
      <span>
        <Power size={15} />
        Quyết định
      </span>

      <strong>
        {irrigationDecision}
      </strong>
    </div>

  </div>

  <div className="rule-box">

    {moisture < 40 && rainLikely && (
      <>
        <strong>🌧️ Không bật bơm</strong>

        <span>
          Đất đang khô nhưng khả năng mưa cao.
          Hệ thống tạm thời không tưới để tiết kiệm nước.
        </span>
      </>
    )}

    {moisture < 40 && !rainLikely && (
      <>
        <strong>Có thể bật bơm</strong>

        <span>
          Đất đang khô và khả năng mưa thấp.
          Hệ thống có thể tưới nước
        </span>
      </>
    )}

    {moisture >= 40 && (
      <>
        <strong>Không cần tưới</strong>

        <span>
          Độ ẩm đất đang ở mức phù hợp.
          Hệ thống không cần bật máy bơm
        </span>
      </>
    )}

  </div>
</Card>
<Card className="condition-card">
  <CardHeader
    icon={CheckCircle}
    title="Điều kiện tưới tự động"
   subtitle={`Cây đang chọn: ${
  currentCrop?.name ||
  (currentCrop === undefined ? 'Chưa chọn' : 'Xà lách')
}`}
  />

  <div className="condition-list">

    {/* Độ ẩm */}
    <div className="condition-item">
      {soilIsDry ? (
        <CheckCircle size={20} />
      ) : (
        <XCircle size={20} />
      )}

      <div>
        <strong>Độ ẩm đất</strong>
        <span>
          {moisture}% · yêu cầu &lt; {currentCrop?.minMoisture}%
        </span>
      </div>

      <b className={soilIsDry ? 'condition-ok' : 'condition-no'}>
        {soilIsDry ? 'Đạt' : 'Không đạt'}
      </b>
    </div>


    {/* Nhiệt độ */}
    <div className="condition-item">
      {temperatureIsSuitable ? (
        <CheckCircle size={20} />
      ) : (
        <XCircle size={20} />
      )}

      <div>
        <strong>Nhiệt độ môi trường</strong>
        <span>
          {weather.temperature}°C · yêu cầu{' '}
          {currentCrop?.minTemperature}–
          {currentCrop?.maxTemperature}°C
        </span>
      </div>

      <b
        className={
          temperatureIsSuitable
            ? 'condition-ok'
            : 'condition-no'
        }
      >
        {temperatureIsSuitable ? 'Đạt' : 'Không đạt'}
      </b>
    </div>


    {/* Mưa */}
    <div className="condition-item">
      {noRain ? (
        <CheckCircle size={20} />
      ) : (
        <XCircle size={20} />
      )}

      <div>
        <strong>Dự báo mưa</strong>
        <span>
          Khả năng mưa {weather.rainProbability}%
        </span>
      </div>

      <b className={noRain ? 'condition-ok' : 'condition-no'}>
        {noRain ? 'Đạt' : 'Không đạt'}
      </b>
    </div>


    {/* Khung giờ */}
    <div className="condition-item">
      {isTimeAllowed ? (
        <CheckCircle size={20} />
      ) : (
        <XCircle size={20} />
      )}

      <div>
        <strong>Khung giờ tưới</strong>
        <span>
          {currentTime} · cho phép{' '}
          {currentCrop?.startTime}–{currentCrop?.endTime}
        </span>
      </div>

      <b
        className={
          isTimeAllowed
            ? 'condition-ok'
            : 'condition-no'
        }
      >
        {isTimeAllowed ? 'Đạt' : 'Không đạt'}
      </b>
    </div>


    {/* Pin */}
    <div className="condition-item">
      {batteryEnough ? (
        <CheckCircle size={20} />
      ) : (
        <XCircle size={20} />
      )}

      <div>
        <strong>Nguồn pin</strong>
        <span>
          {battery}% · yêu cầu trên 20%
        </span>
      </div>

      <b
        className={
          batteryEnough
            ? 'condition-ok'
            : 'condition-no'
        }
      >
        {batteryEnough ? 'Đạt' : 'Không đạt'}
      </b>
    </div>

  </div>


  {/* Kết quả */}
  <div
    className={
      shouldWater
        ? 'irrigation-result irrigation-on'
        : 'irrigation-result irrigation-off'
    }
  >
    <div>
      <strong>
        {shouldWater
          ? 'Sẵn sàng tưới'
          : 'Chưa đủ điều kiện tưới:'}
      </strong>

      <span>
        {shouldWater
          ? '\nTất cả điều kiện đều đạt'
          : '\nCần thỏa mãn tất cả điều kiện để bật bơm'}
      </span>
    </div>

    <b>
      {shouldWater ? 'BƠM ON' : 'BƠM OFF'}
    </b>
  </div>
</Card>
        {/* Chế độ và logic */}
        <div className="grid-2">

          {/* Chế độ hoạt động */}
          <Card>
            <CardHeader
              icon={Activity}
              title="Chế độ hoạt động"
              // subtitle="Lựa chọn cách điều khiển máy bơm"
            />

            <div className="mode-switch">
              <div>
                <strong>Tự động</strong>
                {/* <p>
                  Máy bơm tự động dựa trên độ ẩm đất.
                </p> */}
              </div>

            <button
              className={`switch ${autoMode ? 'checked' : ''}`}
              onClick={() => setAutoMode(!autoMode)}
            >
              <span />
            </button>
            </div>

            <div className="rule-box">
              <span>Độ ẩm hiện tại</span>

              <strong>
                {moisture}%
              </strong>

              <span>
                {autoMode
                  ? 'Hệ thống đang tự động điều khiển máy bơm'
                  : 'Hệ thống đang ở chế độ thủ công'}
              </span>
            </div>
          </Card>

          {/* Logic tự động */}
<Card>
  <CardHeader
    icon={Activity}
    title="Logic quyết định tưới"
    // subtitle="Các điều kiện cần thiết để máy bơm hoạt động"
  />

  <div className="logic-list">

    <div className="logic-row">
      <span>Độ ẩm đất</span>
      <strong>
        &lt; {currentCrop?.minMoisture}%
      </strong>
    </div>

    <div className="logic-row">
      <span>Nhiệt độ môi trường</span>
      <strong>
        {currentCrop?.minTemperature}–
        {currentCrop?.maxTemperature}°C
      </strong>
    </div>

    <div className="logic-row">
      <span>Khả năng mưa</span>
      <strong>&lt; 60%</strong>
    </div>

    <div className="logic-row">
      <span>Khung giờ tưới</span>
      <strong>
        {currentCrop?.startTime}–
        {currentCrop?.endTime}
      </strong>
    </div>

    <div className="logic-row">
      <span>Pin hệ thống</span>
      <strong>&gt; 20%</strong>
    </div>

  </div>

  <div className="logic-result">
    <div>
      <span>Điều kiện tưới</span>
      <strong>
        {shouldWater
          ? 'Đủ điều kiện'
          : 'Chưa đủ điều kiện'}
      </strong>
    </div>

    <b>
      {shouldWater ? 'BẬT BƠM' : 'KHÔNG TƯỚI'}
    </b>
  </div>
</Card>

        </div>
      </section>

      {/* Độ ẩm đất */}
      <section
        className="grid-2"
        style={{ marginTop: '18px' }}
      >

        <Card>
          <CardHeader
            icon={Droplets}
            title="Độ ẩm đất hiện tại"
            // subtitle="Dữ liệu từ cảm biến"
          />

          <div className="energy-big">
            <strong>{moisture}%</strong>

            <span>
              Mức độ ẩm đất hiện tại
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

          <div className="mini-row">
            <span>
              <Droplets size={15} />
              Trạng thái
            </span>

            <strong>
              {moisture < 40
                ? 'Đất khô'
                : moisture >= 65
                ? 'Đủ ẩm'
                : 'Ổn định'}
            </strong>
          </div>
        </Card>

        <Card>
          <CardHeader
            icon={Activity}
            title="Thông tin vận hành"
            // subtitle="Theo dõi trạng thái hệ thống"
          />

          <div className="mini-row">
            <span>Chế độ</span>

            <strong>
              {autoMode ? 'Tự động' : 'Thủ công'}
            </strong>
          </div>

          <div className="mini-row">
            <span>Máy bơm</span>

            <strong>
              {pumpOn ? 'Đang bật' : 'Đang tắt'}
            </strong>
          </div>

<div className="mini-row">
  <span>Ngưỡng bật</span>
  <strong>&lt; {currentCrop?.minMoisture ?? 40}%</strong>
</div>

<div className="mini-row">
  <span>Ngưỡng tắt</span>
  <strong>≥ {currentCrop?.maxMoisture ?? 65}%</strong>
</div>
        </Card>

      </section>
    </>
  );
}