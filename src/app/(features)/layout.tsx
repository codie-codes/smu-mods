import Layout from "@/components/layout";
import { ToastProvider } from "@/components/ToastProvider";

export default function FeatureLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Layout>
      <ToastProvider />
      {children}
    </Layout>
  );
}
