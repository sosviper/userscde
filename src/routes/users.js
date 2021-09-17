const express = require('express');
const router = express.Router();

const pool = require('../database');

router.get('/add', (req, res) => {
    res.render('users/add');
});

router.post('/add', async (req, res) => {
    const { fullname, email, dni, is_checked, fullname_certificado } = req.body;
    const newUser = {
        fullname,
        email,
        dni,
        is_checked,
        fullname_certificado
    };

    await pool.query('INSERT INTO users SET ?', [newUser]);
    req.flash('success', 'Usuario guardado correctamente');
    res.redirect('/users');

    res.send('received');
});

router.get('/', async(req, res) => {
    const users = await pool.query('SELECT * FROM users');
    // console.log(users);
    res.render('users/list', { users });
});

router.get('/delete/:id', async(req, res) => {
    const { id } = req.params;
    await pool.query('DELETE FROM users WHERE id = ?', [id]);
    res.redirect('/users');
});

router.get('/edit/:dni', async(req, res) => {
    const { dni } = req.params;
    const users = await pool.query('SELECT * FROM users WHERE dni = ?', [dni]);
    // console.log(users[0]);
    res.render('users/edit', { users: users[0] });
});

router.post('/edit', async(req, res) => {
    const { dni } = req.body;
    res.redirect('/users/edit/' + dni);
    // res.redirect('/users', { dni });
    // const { dni } = req.params;
    // const users = await pool.query('SELECT * FROM users WHERE dni = ?', [dni]);
    // console.log(users[0]);
    // res.render('users/edit', { users: users[0] });
});

router.post('/edit/:dni', async(req, res) => {
    const { dni } = req.params;
    const { fullname, is_checked, fullname_certificado } = req.body;

    let editUser = {
        fullname, 
        is_checked,
        fullname_certificado
    };
    console.log(editUser);
    // res.send('UPDATED');
    await pool.query('UPDATE users SET ? WHERE dni = ?', [editUser, dni]);
    if (is_checked == 0) {
        req.flash('success', 'El Docente ha confirmado sus datos correctamente.');
        req.flash('success_data', fullname);
    } else {
        req.flash('success', 'El Docente ha confirmado sus datos correctamente.');
        req.flash('success_data', fullname_certificado);
    }
    res.redirect('/users');
});

module.exports = router;