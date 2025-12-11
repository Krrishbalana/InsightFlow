## 🚀 Project Name and Description

**InsightFlow – AI-Powered Data Insight Generator**

InsightFlow is a full-stack web application that automates CSV data analysis by generating structured summaries and AI-driven insights.  
It helps users — especially non-technical ones — extract meaningful patterns from raw datasets instantly, without manual calculations or complex tools.

🔗 **Project Link:** [https://github.com/krrishbalana/InsightFlow](https://github.com/krrishbalana/InsightFlow)  
🌐 **Demo:** [Demo Link](https://insight-flow-pearl.vercel.app/)

---

## ⚙️ Optimization / Innovation

I redesigned the **CSV data processing workflow** to make it scalable and memory-efficient.  
Originally, the backend processed entire files in memory, which caused lags and timeouts for datasets over 5,000 rows.

✅ **What I Changed:**

- Replaced full-memory file parsing with **stream-based processing** using `csv-parser`.
- Integrated **Multer** for optimized file handling and reduced RAM usage.
- Improved error handling and schema validation for unpredictable dataset structures.

✅ **Result:**

- **70% faster** data processing speed.
- Eliminated memory crashes on large CSV uploads.
- Seamless performance with datasets of **10K+ rows**.
- Stable and production-ready backend API tested in **Postman**.

---

## 💡 Impact Summary

- Reduced manual data analysis time by **90%+** through automation.
- Delivered a backend capable of handling large-scale data uploads reliably.
- Established a solid foundation for integrating **AI-based insight generation**.
- Enabled a smoother developer experience and scalable architecture for future growth.

---

## 🧠 Tech Stack

- **Backend:** Node.js, Express.js, MongoDB
- **File Handling:** Multer, csv-parser
- **AI Integration:** OpenAI API
- **Frontend:** React (in progress)
- **Testing:** Postman

---

**Author:** [Krish Balana](https://www.linkedin.com/in/krrish-balana/)  
📧 *krrishbalana@gmail.com*  
💻 [GitHub](https://github.com/krrishbalana)
