import PageDisabledLayout from '@/components/layouts/PageDisabledLayout';
import AboutUsWrapper from '@/pages/help/about-us/AboutUsWrapper';

function AboutUsPage() {
  return (
    <PageDisabledLayout disabled>
      <AboutUsWrapper />
    </PageDisabledLayout>
  );
}

export default AboutUsPage;
