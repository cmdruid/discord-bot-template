/** api/index.js
 * Simple web-server for serving API endpoints.
 **/

import nanoexpress from 'nanoexpress';

const router = nanoexpress();

router.get('/ping', async (req, res) => {
  console.log(req)
  return res.send({ status: 'pong!' });
});

export default router;