import { cookies } from "next/headers";
// ----------------------------------------------------------------------
import { redirect } from "next/navigation";

import { paths } from "@/routes/paths";

import { getAppTheme } from "@/actions/theme";
import { COOKIES_KEYS } from "@/config-global";
import AuthModernCompactLayout from "@/layouts/auth/modern-compact";

type Props = {
  children: React.ReactNode;
  searchParams: {
    returnTo: string;
  };
};

export default async function Layout({ children, searchParams }: Props) {
  const cookiesStore = await cookies();
  const session = cookiesStore.get(COOKIES_KEYS.session)?.value;
  const user = cookiesStore.get(COOKIES_KEYS.user)?.value;

  if (session && user) {
    redirect(paths.home);
  }

  let logo: string | undefined;
  const theme = await getAppTheme();
  if (!("error" in theme)) {
    logo = theme.data?.logo;
  }

  return (
    <AuthModernCompactLayout logo={logo}>{children}</AuthModernCompactLayout>
  );
}
