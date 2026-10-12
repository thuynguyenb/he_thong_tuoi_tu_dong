
import axios from "axios";

const API_URL = "http://localhost:5000/api";

export const getIrrigationData = async () => {
    try {
        const response = await axios.get(`${API_URL}/irrigation`);

        return response.data;
    } catch (error) {
        console.error("Lỗi khi lấy dữ liệu tưới:", error);
        throw error;
    }
};
