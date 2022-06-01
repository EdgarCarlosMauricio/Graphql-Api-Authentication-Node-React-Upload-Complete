import './CommentForm.scss';

import { useMutation } from '@apollo/client';
import { useFormik } from 'formik';
import React from 'react';
import { Button, Form } from 'semantic-ui-react';
import * as Yup from 'yup';

import { ADD_COMMENT } from '../../../../gql/comment';

export default function CommentForm(props) {
    const { publication } = props;
    const [addComment] = useMutation(ADD_COMMENT);

    const formik = useFormik({
        initialValues: {
            comment: ""
        },
        validationSchema: Yup.object({
            comment: Yup.string().required(),
        }),
        onSubmit: async (formData) => {
            try{
                await addComment({
                    variables: {
                        input: {
                            idPublication: publication.id,
                            comment: formData.comment,
                        },
                    },
                });
                formik.handleReset();
            } catch (error) {
                console.log(error);
            }
        }
    })
    
    return (
        <Form className="comment-form" onSubmit={formik.handleSubmit}>
            <Form.Input placeholder="Añade un comentario..."
                name="comment"
                value={formik.values.comment}
                onChange={formik.handleChange}
                error={formik.errors.comment && true}
            />
            <Button type="submit">Publicar</Button>
        </Form>
    );
}
