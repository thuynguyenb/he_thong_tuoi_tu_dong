import React from 'react';
import {
  Settings as SettingsIcon,
  Droplets,
  Save,
  RotateCcw
} from 'lucide-react';

import Card from '../components/Card';
import CardHeader from '../components/CardHeader';

export default function Settings({
  autoMode,
  setAutoMode,
  minMoisture,
  maxMoisture,
  setMinMoisture,
  setMaxMoisture
}) {
  const handleMinChange = (value) => {
    const newValue = Number(value);

    if (newValue < 0) {
      setMinMoisture(0);
      return;
    }

    if (newValue >= maxMoisture) {
      setMinMoisture(maxMoisture - 1);
      return;
    }

    setMinMoisture(newValue);
  };

  const handleMaxChange = (value) => {
    const newValue = Number(value);

    if (newValue > 100) {
      setMaxMoisture(100);
      return;
    }

    if (newValue <= minMoisture) {
      setMaxMoisture(minMoisture + 1);
      return;
    }

    setMaxMoisture(newValue);
  };

  const resetSettings = () => {
    setAutoMode(true);
    setMinMoisture(40);
    setMaxMoisture(65);
  };

  return (
    <>
      {/* Tiêu đề */}
      {/* <section className="page-intro">
        <h2>Cài đặt</h2>

        <p>
          Thiết lập chế độ hoạt động và ngưỡng độ ẩm cho hệ thống
        </p>
      </section> */}

      {/* Cài đặt hệ thống */}
      <section className="grid-2">

        {/* Chế độ hệ thống */}
        <Card>
          <CardHeader
            icon={SettingsIcon}
            title="Chế độ hệ thống"
            // subtitle="Thiết lập phương thức điều khiển"
          />

          <div className="setting-row">
            <div>
              <strong>Chế độ tự động</strong>

              <p>
                Hệ thống tự động bật/tắt máy bơm dựa trên độ ẩm đất
              </p>
            </div>

            <button
              className={`switch ${autoMode ? 'checked' : ''}`}
              onClick={() => setAutoMode(!autoMode)}
              aria-label="Bật hoặc tắt chế độ tự động"
            >
              <span />
            </button>
          </div>

          <div className="mini-row">
            <span>Trạng thái hiện tại</span>

            <strong>
              {autoMode ? 'Tự động' : 'Thủ công'}
            </strong>
          </div>
        </Card>

        {/* Ngưỡng độ ẩm */}
        <Card>
          <CardHeader
            icon={Droplets}
            title="Ngưỡng độ ẩm"
            // subtitle="Thiết lập điều kiện bật và tắt máy bơm"
          />

          <div className="setting-grid">

            <div>
              <label>
                Ngưỡng bật máy bơm

                <input
                  type="number"
                  min="0"
                  max="99"
                  value={minMoisture}
                  onChange={(e) =>
                    handleMinChange(e.target.value)
                  }
                />
              </label>
            </div>

            <div>
              <label>
                Ngưỡng tắt máy bơm

                <input
                  type="number"
                  min="1"
                  max="100"
                  value={maxMoisture}
                  onChange={(e) =>
                    handleMaxChange(e.target.value)
                  }
                />
              </label>
            </div>

          </div>

          <div className="rule-box">
            <span>
              Máy bơm sẽ bật khi độ ẩm thấp hơn
            </span>

            <strong>
              {minMoisture}%
            </strong>

            <span>
              Máy bơm sẽ tắt khi độ ẩm đạt hoặc vượt
            </span>

            <strong>
              {maxMoisture}%
            </strong>
          </div>
        </Card>

      </section>

      {/* Tổng kết */}
      <section className="grid-2">

        <Card>
          <CardHeader
            icon={Droplets}
            title="Tóm tắt điều kiện tưới"
            // subtitle="Các giá trị đang được áp dụng"
          />

          <div className="mini-row">
            <span>Chế độ</span>

            <strong>
              {autoMode ? 'TỰ ĐỘNG' : 'THỦ CÔNG'}
            </strong>
          </div>

          <div className="mini-row">
            <span>Bật bơm khi</span>

            <strong>
              Độ ẩm &lt; {minMoisture}%
            </strong>
          </div>

          <div className="mini-row">
            <span>Tắt bơm khi</span>

            <strong>
              Độ ẩm ≥ {maxMoisture}%
            </strong>
          </div>
        </Card>

        {/* Khôi phục */}
        <Card>
          <CardHeader
            icon={SettingsIcon}
            title="Quản lý cài đặt"
            // subtitle="Khôi phục các giá trị mặc định"
          />

          <button
            className="secondary"
            onClick={resetSettings}
          >
            <RotateCcw size={17} />
            Khôi phục mặc định
          </button>

          <div className="mini-row">
            <span>
              <Save size={15} />
              Giá trị mặc định
            </span>

            <strong>
              40% / 65%
            </strong>
          </div>
        </Card>

      </section>
    </>
  );
}