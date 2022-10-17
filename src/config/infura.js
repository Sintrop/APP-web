import { create } from "ipfs-http-client";
import { concat as uint8ArrayConcat } from 'uint8arrays/concat'
import { toString } from 'uint8arrays/to-string'
// const projectId = '2F2FHYWhdz3ynk8PeorZrtf0FSG';
// const projectSecret = '9cf6a1ddc8510764d564c0f7b9a08cf2';
const projectId =
  "2GEjZR09xX3xGxOIkslo439VTiG";
const projectSecret = "7c513cfa627dda2ff1d8bbbab2376ae1";
const auth =
  "Basic " + Buffer.from(projectId + ":" + projectSecret).toString("base64");

const client = create({
  host: "ipfs.infura.io",
  port: 5001,
  protocol: "https",
  headers: {
    authorization: auth,
  },
});

export const save = async (file) => {
  try {
    const res = await client.add(file)

    return res.path
  } catch(err) {
    console.log(err)
  }
};

export const get = async (path) => {
try {
  const file = []
  for await (const chunk  of client.cat(path)) {
    file.push(chunk)
  }
  const buf = uint8ArrayConcat(file)
  return toString(buf, 'base64')
} catch (error) {
  console.log(error)
}
};
