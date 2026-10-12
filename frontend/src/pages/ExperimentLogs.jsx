import React, { useEffect, useState } from 'react';

import {
  ClipboardPen,
  Save,
  CalendarDays,
  Clock,
  Thermometer,
  Droplets,
  CloudRain,
  FileText,
  Leaf
} from 'lucide-react';

import {
  ref,
  onValue,
  push,
  update
} from 'firebase/database';

import { database } from '../firebase';

import Card from '../components/Card';
import CardHeader from '../components/CardHeader';

export default function ExperimentLogs() {

  const [logs, setLogs] = useState([]);

  const [selectedCrop, setSelectedCrop] = useState('lettuce');

  const [cropSettings, setCropSettings] = useState({
    lettuce: {
      name: 'Xà lách',
      minMoisture: 40,
      maxMoisture: 65,
      minTemperature: 18,
      maxTemperature: 28,
      skipRain: true,
      startTime: '06:00',
      endTime: '08:00'
    },

    tomato: {
      name: 'Cà chua',
      minMoisture: 45,
      maxMoisture: 70,
      minTemperature: 20,
      maxTemperature: 30,
      skipRain: true,
      startTime: '06:00',
      endTime: '08:00'
    }
  });


  const [date, setDate] = useState(
    new Date().toISOString().split('T')[0]
  );

  const [time, setTime] = useState(
    new Date().toTimeString().slice(0, 5)
  );

  const [temperature, setTemperature] = useState('');
  const [soilMoisture, setSoilMoisture] = useState('');
  const [humidity, setHumidity] = useState('');

  const [isRaining, setIsRaining] = useState(false);

  const [note, setNote] = useState('');
  const [conditionResult, setConditionResult] = useState({
  soil: false,
  temperature: false,
  rain: false,
  time: false,
  battery: false,
  shouldWater: false
});
  useEffect(() => {

  const cropsRef = ref(
    database,
    'irrigation/crops'
  );

  const unsubscribe = onValue(
    cropsRef,
    (snapshot) => {

      const data = snapshot.val();

      if (!data) {
        return;
      }

      setCropSettings(prev => ({
        ...prev,

        ...(data.lettuce
          ? {
              lettuce: data.lettuce
            }
          : {}),

        ...(data.tomato
          ? {
              tomato: data.tomato
            }
          : {})
      }));

    },
    (error) => {

      console.error(
        '❌ LỖI ĐỌC THÔNG SỐ CÂY:',
        error
      );

    }
  );

  return () => unsubscribe();

}, []);
const currentCrop =
  cropSettings[selectedCrop];

  const evaluateConditions = async () => {

  if (
    !currentCrop ||
    temperature === '' ||
    soilMoisture === ''
  ) {
    return;
  }

  const soil =
    Number(soilMoisture) <
    Number(currentCrop.minMoisture);

  const temperatureCondition =
    Number(temperature) >=
      Number(currentCrop.minTemperature) &&
    Number(temperature) <=
      Number(currentCrop.maxTemperature);

  const rain =
    currentCrop.skipRain
      ? !isRaining
      : true;

  const timeCondition =
    time >= currentCrop.startTime &&
    time <= currentCrop.endTime;

  /*
   * Lấy pin hiện tại từ Firebase
   */

  const batteryRef = ref(
    database,
    'irrigation/sensors/battery'
  );

  const batterySnapshot =
    await new Promise((resolve, reject) => {

      onValue(
        batteryRef,
        resolve,
        {
          onlyOnce: true,
          errorCallback: reject
        }
      );

    });

  const battery =
    Number(
      batterySnapshot.val() ?? 0
    );

  const batteryCondition =
    battery > 20;

  const shouldWater =
    soil &&
    temperatureCondition &&
    rain &&
    timeCondition &&
    batteryCondition;

  setConditionResult({
    soil,
    temperature: temperatureCondition,
    rain,
    time: timeCondition,
    battery: batteryCondition,
    shouldWater
  });

};
useEffect(() => {

  evaluateConditions();

}, [
  temperature,
  soilMoisture,
  isRaining,
  time,
  selectedCrop,
  currentCrop
]);

  /*
  ========================================
  ĐỌC DỮ LIỆU THỰC NGHIỆM TỪ FIREBASE
  ========================================
  */


  useEffect(() => {

    const experimentRef = ref(
      database,
      'irrigation/experimentLogs'
    );

    const unsubscribe = onValue(
      experimentRef,
      (snapshot) => {

        const data = snapshot.val();

        if (!data) {
          setLogs([]);
          return;
        }

        const logsArray = Object.entries(data)
          .map(([id, log]) => ({
            id,
            ...log
          }))
          .sort(
            (a, b) =>
              new Date(b.timestamp) -
              new Date(a.timestamp)
          );

        setLogs(logsArray);

      },
      (error) => {

        console.error(
          '❌ LỖI ĐỌC DỮ LIỆU THỰC NGHIỆM:',
          error
        );

      }
    );

    return () => unsubscribe();

  }, []);


  /*
  ========================================
  LƯU DỮ LIỆU THỰC NGHIỆM
  ========================================
  */

  const handleSave = async () => {

  if (
    temperature === '' ||
    soilMoisture === '' ||
    humidity === ''
  ) {

    alert(
      'Vui lòng nhập đầy đủ nhiệt độ, độ ẩm đất và độ ẩm không khí.'
    );

    return;
  }

  try {

    const selectedTemperature =
      Number(temperature);

    const selectedSoilMoisture =
      Number(soilMoisture);

    const selectedHumidity =
      Number(humidity);

    /*
    ========================================
    LẤY THÔNG SỐ CÂY TRỒNG
    ========================================
    */

const cropRef = ref(
  database,
  `irrigation/crops/${selectedCrop}`
);

    const cropSnapshot =
      await new Promise((resolve, reject) => {

        onValue(
          cropRef,
          resolve,
          {
            onlyOnce: true,
            errorCallback: reject
          }
        );

      });

    const crop =
      cropSnapshot.val();

    if (!crop) {

      alert(
        'Chưa có thông số cây trồng trong Firebase.'
      );

      return;
    }


    /*
    ========================================
    1. KIỂM TRA ĐỘ ẨM ĐẤT
    ========================================
    */

    const soilIsDry =
      selectedSoilMoisture <
      Number(crop.minMoisture);


    /*
    ========================================
    2. KIỂM TRA NHIỆT ĐỘ
    ========================================
    */

    const temperatureIsSuitable =
      selectedTemperature >=
        Number(crop.minTemperature) &&
      selectedTemperature <=
        Number(crop.maxTemperature);


    /*
    ========================================
    3. KIỂM TRA MƯA
    ========================================
    
    Nếu người dùng nhập "Có mưa"
    thì không cho tưới.
    */

    const noRain =
      crop.skipRain
        ? !isRaining
        : true;


    /*
    ========================================
    4. KIỂM TRA KHUNG GIỜ
    ========================================
    */

    const isTimeAllowed =
      time >= crop.startTime &&
      time <= crop.endTime;


    /*
    ========================================
    5. KIỂM TRA PIN
    ========================================
    
    Lấy mức pin hiện tại từ Firebase.
    */

    const batteryRef =
      ref(
        database,
        'irrigation/sensors/battery'
      );

    const batterySnapshot =
      await new Promise((resolve, reject) => {

        onValue(
          batteryRef,
          resolve,
          {
            onlyOnce: true,
            errorCallback: reject
          }
        );

      });

    const currentBattery =
      Number(
        batterySnapshot.val() ?? 0
      );

    const batteryEnough =
      currentBattery > 20;


    /*
    ========================================
    QUYẾT ĐỊNH CUỐI CÙNG
    ========================================
    
    TẤT CẢ điều kiện phải TRUE.
    */

    const shouldWater =
      soilIsDry &&
      temperatureIsSuitable &&
      noRain &&
      isTimeAllowed &&
      batteryEnough;


    /*
    ========================================
    LÝ DO
    ========================================
    */

    let reason = '';

    if (shouldWater) {

      reason =
        'Tất cả 5 điều kiện đều đạt';

    } else {

      const failedConditions = [];

      if (!soilIsDry) {
        failedConditions.push(
          'độ ẩm đất chưa thấp'
        );
      }

      if (!temperatureIsSuitable) {
        failedConditions.push(
          'nhiệt độ không phù hợp'
        );
      }

      if (!noRain) {
        failedConditions.push(
          'đang có mưa'
        );
      }

      if (!isTimeAllowed) {
        failedConditions.push(
          'ngoài khung giờ tưới'
        );
      }

      if (!batteryEnough) {
        failedConditions.push(
          'pin không đủ'
        );
      }

      reason =
        'Không tưới: ' +
        failedConditions.join(', ');
    }


    /*
    ========================================
    LƯU DỮ LIỆU
    ========================================
    */

    const now = new Date();

    const log = {

      timestamp:
        now.toISOString(),

      date:
        date,

      time:
        time,

      crop:
        crop.name,

      temperature:
        selectedTemperature,

      soilMoisture:
        selectedSoilMoisture,

      humidity:
        selectedHumidity,

      isRaining:
        isRaining,

      battery:
        currentBattery,

      soilIsDry:
        soilIsDry,

      temperatureIsSuitable:
        temperatureIsSuitable,

      noRain:
        noRain,

      isTimeAllowed:
        isTimeAllowed,

      batteryEnough:
        batteryEnough,

      shouldWater:
        shouldWater,

      result:
        shouldWater
          ? 'ON'
          : 'OFF',

      reason:
        reason,

      note:
        note.trim() ||
        'Không có ghi chú'

    };


    /*
    ========================================
    GHI FIREBASE
    ========================================
    */

    const logsRef =
      ref(
        database,
        'irrigation/experimentLogs'
      );

    const newLogRef =
      push(logsRef);

    await update(
      newLogRef,
      log
    );


    console.log(
      '🧪 DỮ LIỆU THỰC NGHIỆM:',
      log
    );


    alert(
      shouldWater
        ? 'Đã lưu! → ĐỦ ĐIỀU KIỆN BẬT BƠM'
        : 'Đã lưu! → KHÔNG ĐỦ ĐIỀU KIỆN TƯỚI'
    );


    /*
    ========================================
    RESET FORM
    ========================================
    */

    setTemperature('');
    setSoilMoisture('');
    setHumidity('');
    setIsRaining(false);
    setNote('');

  } catch (error) {

    console.error(
      '❌ LỖI ĐÁNH GIÁ THỰC NGHIỆM:',
      error
    );

    alert(
      'Không thể lưu dữ liệu thực nghiệm.'
    );

  }

};


  return (
    <>

      {/* ========================================
          TIÊU ĐỀ
      ======================================== */}

      {/* <section className="page-intro">

        <h2>
          Dữ liệu thực nghiệm
        </h2>

        <p>
          Nhập và theo dõi các thông số thực tế
          trong quá trình vận hành hệ thống tưới
        </p>

      </section> */}


      {/* ========================================
          FORM NHẬP DỮ LIỆU
      ======================================== */}

      <Card className="experiment-form-card">

        <CardHeader
          icon={ClipboardPen}
          title="Nhập dữ liệu thực nghiệm"
          // subtitle="Ghi nhận thông số môi trường theo từng thời điểm"
        />

        <div className="experiment-form">
          <div className="form-group">

<label className="form-label-with-icon">
  <Leaf size={17} />
  Cây trồng
</label>

  <select
    value={selectedCrop}
    onChange={(e) =>
      setSelectedCrop(e.target.value)
    }
  >

    <option value="lettuce">
      Xà lách
    </option>

    <option value="tomato">
      Cà chua
    </option>

  </select>

</div>

          {/* Ngày */}

          <div className="form-group">

            <label>
              <CalendarDays size={16} />
              Ngày
            </label>

            <input
              type="date"
              value={date}
              onChange={(e) =>
                setDate(e.target.value)
              }
            />

          </div>


          {/* Thời gian */}

          <div className="form-group">

            <label>
              <Clock size={16} />
              Thời gian
            </label>

            <input
              type="time"
              value={time}
              onChange={(e) =>
                setTime(e.target.value)
              }
            />

          </div>


          {/* Nhiệt độ */}

          <div className="form-group">

            <label>
              <Thermometer size={16} />
              Nhiệt độ (°C)
            </label>

            <input
              type="number"
              min="0"
              max="60"
              step="0.1"
              placeholder="Ví dụ: 27"
              value={temperature}
              onChange={(e) =>
                setTemperature(e.target.value)
              }
            />

          </div>


          {/* Độ ẩm đất */}

          <div className="form-group">

            <label>
              <Droplets size={16} />
              Độ ẩm đất (%)
            </label>

            <input
              type="number"
              min="0"
              max="100"
              step="1"
              placeholder="Ví dụ: 35"
              value={soilMoisture}
              onChange={(e) =>
                setSoilMoisture(e.target.value)
              }
            />

          </div>


          {/* Độ ẩm không khí */}

          <div className="form-group">

            <label>
              <Droplets size={16} />
              Độ ẩm không khí (%)
            </label>

            <input
              type="number"
              min="0"
              max="100"
              step="1"
              placeholder="Ví dụ: 75"
              value={humidity}
              onChange={(e) =>
                setHumidity(e.target.value)
              }
            />

          </div>


          {/* Có mưa */}

          <div className="form-group">

            <label>
              <CloudRain size={16} />
              Tình trạng mưa
            </label>

            <select
              value={
                isRaining
                  ? 'yes'
                  : 'no'
              }
              onChange={(e) =>
                setIsRaining(
                  e.target.value === 'yes'
                )
              }
            >

              <option value="no">
                Không mưa
              </option>

              <option value="yes">
                Có mưa
              </option>

            </select>

          </div>


          {/* Ghi chú */}

          <div className="form-group experiment-note">

            <label>
              <FileText size={16} />
              Ghi chú
            </label>

            <textarea
              rows="3"
              placeholder="Ví dụ: Đất khô, trời nắng, chưa tưới..."
              value={note}
              onChange={(e) =>
                setNote(e.target.value)
              }
            />

          </div>

        </div>


        {/* Nút lưu */}

        <div className="experiment-form-actions">

          <button
            className="primary"
            onClick={handleSave}
          >

            <Save size={17} />

            Lưu dữ liệu thực nghiệm

          </button>

        </div>

      </Card>

<Card className="experiment-crop-card">

  <CardHeader
    icon={ClipboardPen}
    title={`Thông số tham chiếu - ${currentCrop?.name || '---'}`}
    // subtitle="Ngưỡng được sử dụng để đánh giá điều kiện tưới"
  />

  <div className="experiment-crop-grid">

    <div>
      <span>Độ ẩm tối thiểu</span>
      <strong>
        {currentCrop?.minMoisture ?? 0}%
      </strong>
    </div>

    <div>
      <span>Độ ẩm tối đa</span>
      <strong>
        {currentCrop?.maxMoisture ?? 0}%
      </strong>
    </div>

    <div>
      <span>Nhiệt độ tối thiểu</span>
      <strong>
        {currentCrop?.minTemperature ?? 0}°C
      </strong>
    </div>

    <div>
      <span>Nhiệt độ tối đa</span>
      <strong>
        {currentCrop?.maxTemperature ?? 0}°C
      </strong>
    </div>

    <div>
      <span>Khung giờ tưới</span>
      <strong>
        {currentCrop?.startTime || '--:--'}
        {' - '}
        {currentCrop?.endTime || '--:--'}
      </strong>
    </div>

    <div>
      <span>Bỏ qua khi có mưa</span>
      <strong>
        {currentCrop?.skipRain
          ? 'Có'
          : 'Không'}
      </strong>
    </div>

  </div>

</Card>
<Card className="experiment-condition-card">

  <CardHeader
    icon={ClipboardPen}
    title="Đánh giá điều kiện tưới"
    // subtitle="Tất cả điều kiện phải đạt thì hệ thống mới cho phép tưới"
  />

  <div className="experiment-conditions">

    {/* Độ ẩm đất */}

    <div
      className={
        conditionResult.soil
          ? 'experiment-condition passed'
          : 'experiment-condition failed'
      }
    >

      <div className="condition-number">
        1
      </div>

      <div className="condition-content">

        <strong>
          Độ ẩm đất
        </strong>

        <span>
          {soilMoisture || 0}%
          {' < '}
          {currentCrop?.minMoisture ?? 0}%
        </span>

      </div>

      <div className="condition-status">

        {conditionResult.soil
          ? '✓ ĐẠT'
          : '✕ KHÔNG ĐẠT'}

      </div>

    </div>


    {/* Nhiệt độ */}

    <div
      className={
        conditionResult.temperature
          ? 'experiment-condition passed'
          : 'experiment-condition failed'
      }
    >

      <div className="condition-number">
        2
      </div>

      <div className="condition-content">

        <strong>
          Nhiệt độ
        </strong>

        <span>
          {temperature || 0}°C
          {' | '}
          {currentCrop?.minTemperature ?? 0}
          {'–'}
          {currentCrop?.maxTemperature ?? 0}°C
        </span>

      </div>

      <div className="condition-status">

        {conditionResult.temperature
          ? '✓ ĐẠT'
          : '✕ KHÔNG ĐẠT'}

      </div>

    </div>


    {/* Mưa */}

    <div
      className={
        conditionResult.rain
          ? 'experiment-condition passed'
          : 'experiment-condition failed'
      }
    >

      <div className="condition-number">
        3
      </div>

      <div className="condition-content">

        <strong>
          Điều kiện mưa
        </strong>

        <span>
          {isRaining
            ? 'Đang mưa'
            : 'Không mưa'}
        </span>

      </div>

      <div className="condition-status">

        {conditionResult.rain
          ? '✓ ĐẠT'
          : '✕ KHÔNG ĐẠT'}

      </div>

    </div>


    {/* Khung giờ */}

    <div
      className={
        conditionResult.time
          ? 'experiment-condition passed'
          : 'experiment-condition failed'
      }
    >

      <div className="condition-number">
        4
      </div>

      <div className="condition-content">

        <strong>
          Khung giờ tưới
        </strong>

        <span>
          {time}
          {' | '}
          {currentCrop?.startTime || '--:--'}
          {'–'}
          {currentCrop?.endTime || '--:--'}
        </span>

      </div>

      <div className="condition-status">

        {conditionResult.time
          ? '✓ ĐẠT'
          : '✕ KHÔNG ĐẠT'}

      </div>

    </div>


    {/* Pin */}

    <div
      className={
        conditionResult.battery
          ? 'experiment-condition passed'
          : 'experiment-condition failed'
      }
    >

      <div className="condition-number">
        5
      </div>

      <div className="condition-content">

        <strong>
          Nguồn pin
        </strong>

        <span>
          Pin phải lớn hơn 20%
        </span>

      </div>

      <div className="condition-status">

        {conditionResult.battery
          ? '✓ ĐẠT'
          : '✕ KHÔNG ĐẠT'}

      </div>

    </div>

  </div>


  {/* Kết quả */}

  <div
    className={
      conditionResult.shouldWater
        ? 'experiment-final-result allowed'
        : 'experiment-final-result blocked'
    }
  >

    <strong>

      {conditionResult.shouldWater
        ? 'ĐỦ ĐIỀU KIỆN → BẬT BƠM'
        : 'CHƯA ĐỦ ĐIỀU KIỆN → KHÔNG TƯỚI'}

    </strong>

    {/* <span>

      {conditionResult.shouldWater
        ? 'Tất cả 5 điều kiện đều đạt.'
        : 'Chỉ cần một điều kiện không đạt thì hệ thống không tưới.'}

    </span> */}

  </div>

</Card>
      {/* ========================================
          BẢNG LỊCH SỬ
      ======================================== */}

      <Card className="experiment-history-card">

        <CardHeader
          icon={ClipboardPen}
          title="Lịch sử dữ liệu thực nghiệm"
          // subtitle="Các dữ liệu đã ghi nhận trong quá trình thử nghiệm"
        />

        {logs.length === 0 ? (

          <div className="empty-logs">

            <ClipboardPen size={40} />

            <strong>
              Chưa có dữ liệu thực nghiệm
            </strong>

            <span>
              Hãy nhập thông số đầu tiên để bắt đầu.
            </span>

          </div>

        ) : (

          <div className="logs-table-wrapper">

            <table className="logs-table">

              <thead>

                <tr>

  <th>Ngày</th>
  <th>Thời gian</th>
  <th>Cây trồng</th>
  <th>Nhiệt độ</th>

                  <th>Độ ẩm đất</th>

                  <th>Độ ẩm KK</th>

                  <th>Mưa</th>

                  <th>Quyết định</th>

                  <th>Lý do</th>

                  <th>Ghi chú</th>

                </tr>

              </thead>

              <tbody>

                {logs.map((log) => (

                  <tr key={log.id}>

                    <td>
                      {log.date}
                    </td>

                    <td>
                      {log.time}
                    </td>
<td>
  <strong>
    {log.crop || '---'}
  </strong>
</td>
                    <td>
                      {log.temperature ?? 0}°C
                    </td>

                    <td>
                      {log.soilMoisture ?? 0}%
                    </td>

                    <td>
                      {log.humidity ?? 0}%
                    </td>

                    <td>

                      {log.isRaining
                        ? 'Có mưa'
                        : 'Không mưa'}

                    </td>
<td>

  <span
    className={
      log.result === 'ON'
        ? 'log-status log-on'
        : 'log-status log-off'
    }
  >

    {log.result === 'ON'
      ? 'BẬT BƠM'
      : 'KHÔNG TƯỚI'}

  </span>

</td>

<td>

  <span className="log-reason">

    {log.reason || '---'}

  </span>

</td>
                    <td>
                      {log.note || '---'}
                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        )}


        {/* Tổng số */}

        <div className="logs-summary">

          <div>

            <span>
              Tổng số mẫu
            </span>

            <strong>
              {logs.length}
            </strong>

          </div>

        </div>

      </Card>

    </>

  );

}