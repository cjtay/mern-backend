const express = require('express');

const router = express.Router();

const DUMMY_USERS = [
    {
        id: 'u1',
        name: 'Tay',
        image:
            'https://images.pexels.com/photos/1907047/pexels-photo-1907047.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
        places: 3
    }
];

router.get('/:uid', (req, res, next) => {
    const userId = req.params.uid;
    const user = DUMMY_USERS.find(u => {
        return u.id === userId;
    });
    res.json({ user });
});

module.exports = router;
