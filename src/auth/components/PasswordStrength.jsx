export default function PasswordStrength({ password }) {
  const length = password.length;

  let label = "Weak";
  let color = "bg-red-500";
  let width = "25%";

  if (length >= 8) {
    label = "Medium";
    color = "bg-yellow-500";
    width = "60%";
  }

  if (length >= 12) {
    label = "Strong";
    color = "bg-green-600";
    width = "100%";
  }

  return (
    <div className="mt-3">

      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">

        <div
          className={`${color} h-full`}
          style={{ width }}
        />

      </div>

      <p className="text-sm text-gray-600 mt-2">
        Password Strength: <strong>{label}</strong>
      </p>

    </div>
  );
}