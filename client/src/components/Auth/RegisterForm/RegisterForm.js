import './RegisterForm.scss';

import { useMutation } from '@apollo/client';
import { useFormik } from 'formik';
import React from 'react';
import { toast } from 'react-toastify';
import { Button, Form } from 'semantic-ui-react';
import * as Yup from 'yup';

import { REGISTER } from '../../../gql/user';

export default function RegisterForm(props) {
    //console.log("props", props);

    const { setShowLogin } = props;
    const [register] = useMutation(REGISTER);

    const formik = useFormik({
        initialValues: initialValues(),
        validationSchema: Yup.object({
            name: Yup.string().required("Tu nombre es obligatorio"),
            username: Yup.string().matches(/^[a-zA-Z0-9-]*$/, "El nombre del usuario no puede tener espacio").required("El nombre de usuario es obligatorio"),
            email: Yup.string().email("El email no es valido").required("El email es obligatorio"),
            password: Yup.string().required("La contraseña es obligatoria").oneOf([Yup.ref("repeatPassword")], "Las contraseñas no son iguales"),
            repeatPassword: Yup.string().required("La contraseña es obligatoria").oneOf([Yup.ref("password")], "Las contraseñas no son iguales"),
        }),
        onSubmit: async (formData) => { 
            try {
                const newUser = formData;
                delete newUser.repeatPassword;
                // console.log("INPUTMAOLOGINNew", newUser);
                await register({
                    variables: {
                        input: newUser,
                    },
                });
                toast.success("Usuario registrado correctamente");
                setShowLogin(true);
            } catch (error) {
                toast.error(error.message);
                console.log(error.message);
            }
        }
    });

    
    return (
        <>
            <h2 className='register-form-title'>Registrate Para Ver Fotos Y Videos De Tus Amigos</h2>
            <Form className='register-form' onSubmit={formik.handleSubmit}>
                <Form.Input type="text" placeholder="Nombre y apellido" name="name" value={formik.values.name} onChange={formik.handleChange} error={formik.errors.name && true} />
                <Form.Input type="text" placeholder="Nombre de usuario" name="username" value={formik.values.username} onChange={formik.handleChange} error={formik.errors.username && true} />
                <Form.Input type="text" placeholder="Correo electronico" name="email" value={formik.values.email} onChange={formik.handleChange} error={formik.errors.email && true} />
                <Form.Input type="password" placeholder="Contraseña" name="password" value={formik.values.password} onChange={formik.handleChange} error={formik.errors.password && true} />
                <Form.Input type="password" placeholder="Repetir contraseña" name="repeatPassword" value={formik.values.repeatPassword} onChange={formik.handleChange} error={formik.errors.repeatPassword && true} />
                <Button type="submit" className='btn-submit'>Registrarse</Button>
                {/* reset de formulario funcionando, aunque no lo usaremos en esta app
                <Button type="button" onClick={formik.handleReset} className='btn-submit'>Reiniciar formulario</Button> */}
            </Form>
        </>
    );
}

function initialValues() { 
    return {
        name: "",
        username: "",
        email: "",
        password: "",
        repeatPassword: ""
    };
}


