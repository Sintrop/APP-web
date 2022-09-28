import { create } from 'ipfs-http-client'

const projectId = '2F2FHYWhdz3ynk8PeorZrtf0FSG';
const projectSecret = '9cf6a1ddc8510764d564c0f7b9a08cf2';
const auth =
    'Basic ' + Buffer.from(projectId + ':' + projectSecret).toString('base64');

const client = create({
  host: 'ipfs.infura.io',
  port: 5001,
  protocol: 'https',
  headers: {
    authorization: auth,
  }
})

export const exec = () => {
  client.pin.add('QmeGAVddnBSnKc1DLE7DLV9uuTqo5F7QbaveTjr45JUdQn').then((res) => {
    console.log(res);
  });
}
