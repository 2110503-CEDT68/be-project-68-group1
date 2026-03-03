const express = require('express');
const {getRooms, getRoom, createRoom, updateRoom, deleteRoom} = require('../controllers/rooms')

const router = express.Router();

const reservationRouter = require('./reservations');

const {protect,authorize} = require('../middleware/auth');

router.use('/:roomId/reservations/', reservationRouter);

router.route('/').get(getRooms).post(protect,authorize('admin'),createRoom);
router.route('/:id').get(getRoom).put(protect,authorize('admin'),updateRoom).delete(protect,authorize('admin'),deleteRoom);

module.exports = router;

/**
 * @swagger
 * components:
 *   schemas:
 *     Room:
 *       type: object
 *       required:
 *         - name
 *         - address
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: The auto-generated id of the Room
 *           example: d290f1ee-6c54-4b01-90e6-d701748f0851
 *         ลำดับ:
 *           type: string
 *           description: Ordinal number
 *         name:
 *           type: string
 *           description: Room name
 *         address:
 *           type: string
 *           description: House No., Street, Road
 *         district:
 *           type: string
 *           description: District
 *         province:
 *           type: string
 *           description: Province
 *         postalcode:
 *           type: string
 *           description: 5-digit postal code
 *         tel:
*           type: string
*           description: telephone number
*         region:
*           type: string
*           description: region
*       example:
*         id: 609bda561452242d88d36e37
*         ลำดับ: 121
*         name: Happy Room
*         address: 121 ถ.สุขุมวิท
*         district: บางนา
*         province: กรุงเทพมหานคร
*         postalcode: 10110
*         tel: 02-2187000
*         region: กรุงเทพมหานคร (Bangkok)
*/

/**
 * @swagger
 * tags:
 *   name: Rooms
 *   description: The Rooms managing API
 */

/**
 * @swagger
 * /Rooms:
 *   get:
 *     summary: Returns the list of all the Rooms
 *     tags: [Rooms]
 *     responses:
 *       200:
 *         description: The list of the Rooms
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Room'
 */

/**
 * @swagger
 * /Rooms/{id}:
 *   get:
 *     summary: Get the Room by id
 *     tags: [Rooms]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The Room id
 *     responses:
 *       200:
 *         description: The Room description by id
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Room'
 *       404:
 *         description: The Room was not found
 */

/**
 * @swagger
 * /Rooms:
 *   post:
 *     summary: Create a new Room
 *     tags: [Rooms]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Room'
 *     responses:
 *       201:
 *         description: The Room was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Room'
 *       500:
 *         description: Some server error
 */

/**
 * @swagger
 * /Rooms/{id}:
 *   put:
 *     summary: Update the Room by the id
 *     tags: [Rooms]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The Room id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Room'
  *     responses:
 *       200:
 *         description: The Room was updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Room'
 *       404:
 *         description: The Room was not found
 *       500:
 *         description: Some error happened
 */

/**
 * @swagger
 * /Rooms/{id}:
 *   delete:
 *     summary: Remove the Room by id
 *     tags: [Rooms]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The Room id
 *
 *     responses:
 *       200:
 *         description: The Room was deleted
 *       404:
 *         description: The Room was not found
 */