import React, { useEffect, useState } from 'react';
import {
  ClipboardList,
  CheckCircle,
  XCircle,
  Droplets,
  Thermometer,
  CloudRain,
  BatteryCharging
} from 'lucide-react';

import { ref, onValue } from 'firebase/database';
import { database } from '../firebase';

import Card from '../components/Card';
import CardHeader from '../components/CardHeader';

export default function IrrigationLogs() {

  const [logs, setLogs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
const logsPerPage = 10;

const totalPages = Math.ceil(logs.length / logsPerPage);

const startIndex = (currentPage - 1) * logsPerPage;

const currentLogs = logs.slice(
  startIndex,
  startIndex + logsPerPage
);

const goToPage = (page) => {
  setCurrentPage(
    Math.max(1, Math.min(page, totalPages))
  );
};

  useEffect(() => {

    const logsRef = ref(
      database,
      'irrigation/logs'
    );

    const unsubscribe = onValue(
      logsRef,
      (snapshot) => {

        const data = snapshot.val();

        if (!data) {
          setLogs([]);
          return;
        }

        const logsArray = Object.entries(data).map(
          ([id, log]) => ({
            id,
            ...log
          })
        );

        // Log mới nhất lên đầu
        logsArray.sort(
          (a, b) =>
            new Date(b.timestamp) -
            new Date(a.timestamp)
        );

        setLogs(logsArray);
        setCurrentPage((page) =>
  Math.max(
    1,
    Math.min(
      page,
      Math.max(1, Math.ceil(logsArray.length / logsPerPage))
    )
  )
);

        console.log(
          '📋 NHẬT KÝ TƯỚI:',
          logsArray
        );
      },
      (error) => {
        console.error(
          '❌ LỖI ĐỌC NHẬT KÝ:',
          error
        );
      }
    );

    return () => unsubscribe();

  }, []);

  return (
    <>
      {/* <section className="page-intro">
        <h2>Nhật ký tưới</h2>

        <p>
          Theo dõi lịch sử hoạt động và quyết định
          tưới của hệ thống
        </p>
      </section> */}

      <Card className="irrigation-logs-card">

        <CardHeader
          icon={ClipboardList}
          title="Lịch sử tưới"
          // subtitle="Dữ liệu được cập nhật trực tiếp từ Firebase"
        />

        {logs.length === 0 ? (

          <div className="empty-logs">
            <ClipboardList size={40} />

            <strong>
              Chưa có nhật ký tưới
            </strong>

            <span>
              Nhật ký sẽ xuất hiện khi trạng thái
              máy bơm thay đổi
            </span>
          </div>

        ) : (

          <div className="logs-table-wrapper">

            <table className="logs-table">

              <thead>
                <tr>
                  <th>Thời gian</th>
                  <th>Cây trồng</th>
                  <th>Độ ẩm</th>
                  <th>Nhiệt độ</th>
                  <th>Mưa</th>
                  <th>Pin</th>
                  <th>Kết quả</th>
                  <th>Lý do</th>
                </tr>
              </thead>

              <tbody>

                {currentLogs.map((log) => {

                  const isOn =
                    log.status === 'ON';

                  return (
                    <tr key={log.id}>

                      <td>
                        <div className="log-time">
                          <strong>
                            {log.date}
                          </strong>

                          <span>
                            {log.time}
                          </span>
                        </div>
                      </td>

                      <td>
                        <strong>
                          {log.crop || '---'}
                        </strong>
                      </td>

                      <td>
                        <div className="log-value">
                          <Droplets size={15} />
                          {log.soilMoisture ?? 0}%
                        </div>
                      </td>

                      <td>
                        <div className="log-value">
                          <Thermometer size={15} />
                          {log.temperature ?? 0}°C
                        </div>
                      </td>

                      <td>
                        <div className="log-value">
                          <CloudRain size={15} />
                          {log.rainProbability ?? 0}%
                        </div>
                      </td>

                      <td>
                        <div className="log-value">
                          <BatteryCharging size={15} />
                          {log.battery ?? 0}%
                        </div>
                      </td>

                      <td>
                        <span
                          className={
                            isOn
                              ? 'log-status log-on'
                              : 'log-status log-off'
                          }
                        >
                          {isOn ? (
                            <CheckCircle size={14} />
                          ) : (
                            <XCircle size={14} />
                          )}

                          {isOn
                            ? 'BƠM ON'
                            : 'BƠM OFF'}
                        </span>
                      </td>

                      <td>
                        <span className="log-reason">
                          {log.reason || '---'}
                        </span>
                      </td>

                    </tr>
                  );

                })}

              </tbody>

            </table>

          </div>

        )}

        <div className="logs-pagination">
  <span className="pagination-info">
    Hiển thị {logs.length === 0 ? 0 : startIndex + 1}
    –{Math.min(startIndex + logsPerPage, logs.length)}
    {' '}trong tổng số {logs.length} nhật ký
  </span>

  <div className="pagination-controls">
<button
  className="pagination-btn"
  onClick={() => goToPage(currentPage - 1)}
  disabled={currentPage === 1}
>
  ← Trước
</button>

{/* Trang đầu */}
<button
  className={`pagination-btn ${currentPage === 1 ? 'active' : ''}`}
  onClick={() => goToPage(1)}
>
  1
</button>

{/* Dấu ba chấm phía trước */}
{currentPage > 3 && (
  <span className="pagination-dots">…</span>
)}

{/* Các trang gần trang hiện tại */}
{Array.from(
  { length: totalPages },
  (_, index) => index + 1
)
  .filter(
    (page) =>
      page !== 1 &&
      page !== totalPages &&
      Math.abs(page - currentPage) <= 1
  )
  .map((page) => (
    <button
      key={page}
      className={`pagination-btn ${
        currentPage === page ? 'active' : ''
      }`}
      onClick={() => goToPage(page)}
    >
      {page}
    </button>
  ))}

{/* Dấu ba chấm phía sau */}
{currentPage < totalPages - 2 && (
  <span className="pagination-dots">…</span>
)}

{/* Trang cuối */}
{totalPages > 1 && (
  <button
    className={`pagination-btn ${
      currentPage === totalPages ? 'active' : ''
    }`}
    onClick={() => goToPage(totalPages)}
  >
    {totalPages}
  </button>
)}

<button
  className="pagination-btn"
  onClick={() => goToPage(currentPage + 1)}
  disabled={
    totalPages === 0 || currentPage === totalPages
  }
>
  Sau →
</button>
  </div>
</div>

        <div className="logs-summary">

          <div>
            <span>Tổng số nhật ký</span>
            <strong>
              {logs.length}
            </strong>
          </div>

          <div>
            <span>Số lần bật bơm</span>
            <strong>
              {
                logs.filter(
                  log => log.status === 'ON'
                ).length
              }
            </strong>
          </div>

          <div>
            <span>Số lần tắt bơm</span>
            <strong>
              {
                logs.filter(
                  log => log.status === 'OFF'
                ).length
              }
            </strong>
          </div>

        </div>

      </Card>
    </>
  );
}