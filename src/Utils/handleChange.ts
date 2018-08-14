
import { Component } from 'react';

export const handleChange = (that: Component) => {
    return (event: any) => {
        that.setState({
            [event.target.name]: event.target.value,
        });
    };
};