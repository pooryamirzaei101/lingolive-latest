import { ReadingSizeControl } from "@/components/appearance-preference";

export default function SettingsPage() {
  return <section className="section shell settings-page">
    <span className="section-eyebrow">YOUR SPACE</span>
    <h1>Settings</h1>
    <p>Make lessons comfortable to read and follow.</p>
    <div className="detail-panel"><h2>Appearance</h2><ReadingSizeControl/></div>
  </section>;
}
