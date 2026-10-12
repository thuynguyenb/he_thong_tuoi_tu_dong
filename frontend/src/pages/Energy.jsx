import React from 'react';
import {
  BatteryCharging,
  Sun,
  Zap,
  Activity
} from 'lucide-react';

import Card from '../components/Card';
import CardHeader from '../components/CardHeader';

export default function Energy({
  battery,
  solarPower
}) {
  return (
    <>
      {/* Tiêu đề */}
      {/* <section className="page-intro">
        <h2>Năng lượng</h2>
        <p>
          Theo dõi nguồn điện mặt trời và tình trạng pin của hệ thống
        </p>
      </section> */}

      {/* Tổng quan năng lượng */}
      <section className="grid-2">

        {/* Điện mặt trời */}
        <Card>
          <CardHeader
            icon={Sun}
            title="Năng lượng mặt trời"
            // subtitle="Nguồn năng lượng đang cung cấp"
          />

          <div className="energy-visual">
            <div className="sun-box">
              <Sun size={38} />
            </div>

            <div>
              <strong>{solarPower} W</strong>

              <span>
                Công suất hiện tại
              </span>
            </div>
          </div>

          <div className="mini-row">
            <span>
              <Zap size={15} />
              Trạng thái
            </span>

            <strong>
              {solarPower >= 70
                ? 'Tốt'
                : solarPower >= 40
                ? 'Trung bình'
                : 'Thấp'}
            </strong>
          </div>

          <div className="mini-row">
            <span>Nguồn điện</span>
            <strong>Điện mặt trời</strong>
          </div>
        </Card>

        {/* Pin */}
        <Card>
          <CardHeader
            icon={BatteryCharging}
            title="Dung lượng pin"
            // subtitle="Mức năng lượng lưu trữ"
          />

          <div className="battery">
            <div className="battery-head" />

            <div className="battery-body">
              <div
                style={{
                  height: `${Math.min(
                    Math.max(battery, 0),
                    100
                  )}%`
                }}
              />
            </div>
          </div>

          <strong className="battery-value">
            {battery}%
          </strong>

          <div className="mini-row">
            <span>
              <BatteryCharging size={15} />
              Trạng thái
            </span>

            <strong>
              {battery >= 70
                ? 'Tốt'
                : battery >= 30
                ? 'Trung bình'
                : 'Thấp'}
            </strong>
          </div>
        </Card>

      </section>

      {/* Thông tin chi tiết */}
      <section className="grid-2">

        <Card>
          <CardHeader
            icon={Activity}
            title="Trạng thái hệ thống"
            // subtitle="Thông tin vận hành năng lượng"
          />

          <div className="mini-row">
            <span>Nguồn chính</span>
            <strong>Điện mặt trời</strong>
          </div>

          <div className="mini-row">
            <span>Công suất hiện tại</span>
            <strong>{solarPower} W</strong>
          </div>

          <div className="mini-row">
            <span>Mức pin</span>
            <strong>{battery}%</strong>
          </div>

          <div className="mini-row">
            <span>Trạng thái</span>
            <strong>
              {battery > 20 ? 'Ổn định' : 'Cảnh báo'}
            </strong>
          </div>
        </Card>

        {/* <Card>
          <CardHeader
            icon={Sun}
            title="Hiệu quả năng lượng"
            // subtitle="Đánh giá nhanh"
          />

          <div className="energy-visual">
            <div className="sun-box">
              <Sun size={30} />
            </div>

            <div>
              <strong>
                {solarPower >= 70
                  ? 'Hiệu suất tốt'
                  : solarPower >= 40
                  ? 'Hiệu suất trung bình'
                  : 'Hiệu suất thấp'}
              </strong>

              <span>
                Công suất mặt trời: {solarPower} W
              </span>
            </div>
          </div>

          <div className="mini-row">
            <span>
              <Zap size={15} />
              Đánh giá
            </span>

            <strong>
              {solarPower >= 70
                ? 'Tốt'
                : solarPower >= 40
                ? 'Trung bình'
                : 'Cần cải thiện'}
            </strong>
          </div>
        </Card> */}

      </section>
    </>
  );
}