"use server";

import { endpoints } from "@/utils/endpoints";
import { getData } from "@/utils/crud-fetch-api";

import { AppTheme } from "@/types/theme";

export async function getAppTheme() {
  const res = await getData<AppTheme>(endpoints.theme);
  return res;
}
