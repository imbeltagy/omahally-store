import StoreLayout from "@/layouts/store";
import { getAppTheme } from "@/actions/theme";

export default async function Layout({
  children,
  initcart,
  noguest,
}: {
  children: React.ReactNode;
  initcart: React.ReactNode;
  noguest: React.ReactNode;
}) {
  let logo: string | undefined;
  const theme = await getAppTheme();
  if (!("error" in theme)) {
    logo = theme.data?.logo;
  }

  return (
    <StoreLayout logo={logo}>
      {children}
      {initcart}
      {noguest}
    </StoreLayout>
  );
}
