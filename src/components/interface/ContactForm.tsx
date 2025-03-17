import { useState } from 'react';
import TitreH2 from './TitreH2';
import pageServices from '../../services/pages';
import './forms.css';
import Dropdown from './Dropdown';

interface Message {
    prenom: string;
    nom: string;
    email: string;
    message: string;
    objet: string;
}

const ContactForm = ({ titre, sousTitre, fields, message, object_option }: any) => {
    const [formMessage, setFormMessage] = useState('');
    const [messageType, setMessageType] = useState('');

    const [formData, setFormData] = useState<Message>({
        objet: '',
        prenom: '',
        nom: '',
        email: '',
        message: ''
    });

    const handleChange = (e: any) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleDropdownChange = (value: string) => {
        setFormData((prev) => ({
            ...prev,
            objet: value // 🔥 Met à jour `objet` dans `formData`
        }));
    };

    const dataValidation = (data: Message) => {
        let isValid = true;
        let emptyFields: string[] = [];

        Object.entries(data).forEach(([key, value]) => {
            if (value.trim() === '') { 
                isValid = false;
                emptyFields.push(key);
            }
        });

        if (!isValid) {
            setFormMessage(`${message.missing} (${emptyFields.join(", ")})`);
            setMessageType('alert-message');
        }

        return isValid;
    };

    const handleSubmit = (e: any) => {
        e.preventDefault();

        if (!dataValidation(formData)) return;

        const req = { data: formData };
        try {
            pageServices
                .sendForm(req)
                .then(() => {
                    setFormMessage(message.success);
                    setFormData({ objet: '', prenom: '', nom: '', email: '', message: '' });
                    setMessageType('');
                    setTimeout(() => {
                        setFormMessage('');
                    }, 3000);
                })
                .catch((error) => {
                    console.error('Error sending message:', error);
                });
        } catch (error) {
            setFormMessage(message.error);
            setMessageType('alert-message');
            console.error('Error sending form data:', error);
            throw error;
        }
    };

    return (
        <>
            <TitreH2 titre={titre} sousTitre={sousTitre} />
            <form onSubmit={handleSubmit}>
                <aside>
                    <div className='filter'>
                        <Dropdown 
                            data={object_option} 
                            onSelect={handleDropdownChange} // 🎯 Met à jour `objet`
                        />
                    </div>
                </aside>
                <aside>
                    <div className='columns-2'>
                        <label htmlFor="nom">{fields.nameLabel}*</label>
                        <input
                            type="text"
                            id="nom"
                            name="nom"
                            value={formData.nom}
                            onChange={handleChange}
                        />
                    </div>
                    <div className='columns-2'>
                        <label htmlFor="prenom">{fields.first_name}*</label>
                        <input
                            type="text"
                            id="prenom"
                            name="prenom"
                            value={formData.prenom}
                            onChange={handleChange}
                        />
                    </div>
                </aside>
                <div>
                    <label htmlFor="email">{fields.emailLabel}*</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label htmlFor="message">{fields.messageLabel}*</label>
                    <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                    ></textarea>
                </div>
                <button type="submit" className='primary-button'>{fields.submitLabel}</button>
            </form>
            <p className={`form-message ${messageType}`}>{formMessage}</p>
        </>
    );
};

export default ContactForm;
