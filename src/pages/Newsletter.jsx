import NewsletterHero from "../newsletter/components/NewsletterHero";
import NewsletterBenefits from "../newsletter/components/NewsletterBenefits";
import NewsletterSignup from "../newsletter/components/NewsletterSignup";

export default function Newsletter() {
  return (
    <div>

      {/* Newsletter Hero */}
      <NewsletterHero />

      {/* Newsletter Benefits */}
      <NewsletterBenefits />

      {/* Newsletter Signup */}
      <NewsletterSignup />

    </div>
  );
}