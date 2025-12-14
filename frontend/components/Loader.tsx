
export default function Loader({ text }: { text: string }) {
    return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "12px",
        padding: "16px",
        marginTop: "12px",
      }}
    >
      <div
        style={{
          width: "22px",
          height: "22px",
          border: "3px solid #334155",
          borderTop: "3px solid #3b82f6",
          borderRadius: "50%",
          animation: "spin 1s linear infinite",
        }}
      />
      <span style={{ color: "white" }}>{text}</span>

      <style jsx>{`
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}
