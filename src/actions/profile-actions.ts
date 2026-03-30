"use server";

import { endpoints } from "@/utils/endpoints";
import {
  getData,
  editData,
  postData,
  deleteData,
} from "@/utils/crud-fetch-api";

import { Address, FullAddress } from "@/types/profile";

export async function fetchAddresses() {
  const res = await getData<FullAddress[]>(endpoints.address.root);

  if ("error" in res) {
    return res;
  }
  return res?.data;
}

interface AddAddressDataBody {
  name: string;
  address: string;
  latitude: string;
  longitude: string;
  is_favorite: boolean;
  phone: string;
}

export async function addAddress(dataBody: AddAddressDataBody) {
  const res = await postData<Address, AddAddressDataBody>(
    endpoints.address.root,
    dataBody,
  );

  if ("error" in res) {
    return res;
  }

  return res?.data;
}
interface EditAddressDataBody extends AddAddressDataBody {
  id: string;
}

export async function editAddress(dataBody: EditAddressDataBody) {
  const res = await editData<Address, EditAddressDataBody>(
    endpoints.address.root,
    "PUT",
    dataBody,
  );

  if ("error" in res) {
    return res;
  }

  return res?.data;
}

export async function deleteAddress(id: string) {
  const res = await deleteData<any>(endpoints.address.delete(id));

  if ("error" in res) {
    return res;
  }

  return res?.data;
}

export async function setFavoriteAddress(id: string) {
  const res = await editData<any, {}>(
    endpoints.address.setFavorite(id),
    "PUT",
    {},
  );

  if ("error" in res) {
    return res;
  }

  return res?.data;
}
