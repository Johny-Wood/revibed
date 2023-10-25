import LinkDefault from '@/components/ui/links/LinkDefault';

import styles from './styles.module.scss';

function BlackCatCardDisclaimer() {
  return (
    <div className={styles.blackCatCardInstruction__disclaimer}>
      <ul>
        <li>
          This is&nbsp;a&nbsp;one-time offer for new Blackcatcard customers, who reside in&nbsp;one of&nbsp;the EEA countries
          or&nbsp;Switzerland.
        </li>
        <li>
          The bonus payment is&nbsp;a&nbsp;part of&nbsp;the loyalty program provided by&nbsp;FINTECH ASSETS O&Uuml;. Detailed
          terms and conditions can be&nbsp;found at&nbsp;the following link:&thinsp;
          <LinkDefault
            href="https://fintechassetsou.com/loyality-program.html"
            text="https://fintechassetsou.com/loyality-program.html"
          />
        </li>
        <li>
          Pricing, terms of&nbsp;use, legal agreements, and detailed product information can be&nbsp;found at&nbsp;the following
          link:&thinsp;
          <LinkDefault href="https://get.blackcatcard.com" text="https://get.blackcatcard.com" />
        </li>
        <li>
          If&nbsp;you have questions, regarding Blackcatcard product, please, contact the support team via the in-app chat
          in&nbsp;the Blackcatcatcard mobile application (registration is&nbsp;not required), or&nbsp;via the email&thinsp;
          <LinkDefault href="mailto:support2@blackcatcard.com" text="support2@blackcatcard.com" />
        </li>
        <li>Blackcatcard is&nbsp;issued by&nbsp;Papaya Ltd. Registration number: C55146.</li>
      </ul>
    </div>
  );
}

export default BlackCatCardDisclaimer;
