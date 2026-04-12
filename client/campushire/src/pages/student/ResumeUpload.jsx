// pages/student/ResumeUpload.jsx
export default function ResumeUpload() {
  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-xl border border-[#6B8C72]/30">
      <h2 className="text-xl font-bold mb-4">Upload Resume</h2>

      <input type="file" className="mb-4" />

      <button className="bg-[#6B8C72] text-white px-4 py-2 rounded">
        Upload
      </button>
    </div>
  );
}