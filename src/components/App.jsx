import { useEffect, useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import css from './App.module.css';

axios.defaults.baseURL = 'https://virtual-zoo-mongodb.onrender.com/';

export const App = () => {
  const [animals, setAnimals] = useState([]);
  const [newAnimal, setNewAnimal] = useState({
    hologram_name: '',
    weight: '',
    superpower: '',
    extinct_since: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get('animals');
        setAnimals(res.data);
      } catch (err) {
        notifyE(err.message);
      }
    };

    fetchData();
  }, []);

  const deleteAnimal = async _id => {
    try {
      const res = await axios.delete(`animals/${_id}`);
      const newData = animals.filter(animal => animal._id !== _id);
      setAnimals(newData);
      notifyS(res.data.message);
    } catch (err) {
      notifyE(err.message);
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const newData = {
      hologram_name: e.target.elements.name.value,
      weight: e.target.elements.weight.value,
      superpower: e.target.elements.superpower.value,
      extinct_since: e.target.elements.extinct_since.value,
    };
    console.log(newData);
    try {
      const res = await axios.patch(`animals/${e.target.id}`, newData);
      const updatedData = await axios.get('animals');
      setAnimals(updatedData.data);
      notifyS(res.data.message);
    } catch (err) {
      notifyE(err.message);
    }
  };

  const handleChange = e => {
    const { name, value } = e.target;
    setNewAnimal({ ...newAnimal, [name]: value });
  };

  const addAnimal = async () => {
    try {
      const res = await axios.post('animals', newAnimal);
      setNewAnimal({
        hologram_name: '',
        weight: '',
        superpower: '',
        extinct_since: '',
      });
      const updatedData = await axios.get('animals');
      setAnimals(updatedData.data);
      notifyS(res.data.message);
    } catch (err) {
      notifyE(err.message);
    }
  };

  const notifyS = message => toast.success(message);
  const notifyE = message => toast.error(message);

  return (
    <div className={css.wrapper}>
      <h1 className={css.title}>Virtual Zoo</h1>
      <ul className={css.list}>
        {animals.map(animal => (
          <li className={css.listItem} key={animal._id}>
            <form className={css.form} id={animal._id} onSubmit={handleSubmit}>
              <p>
                Name:{' '}
                <input
                  className={css.listItemInput}
                  type="text"
                  name="name"
                  defaultValue={animal.hologram_name}
                />
              </p>
              <p>
                Weight:{' '}
                <input
                  className={css.listItemInput}
                  type="text"
                  name="weight"
                  defaultValue={animal.weight}
                />
              </p>
              <p>
                Super power:{' '}
                <input
                  className={css.listItemInput}
                  type="text"
                  name="superpower"
                  defaultValue={animal.superpower}
                />
              </p>
              <p>
                Extinct since:{' '}
                <input
                  className={css.listItemInput}
                  type="text"
                  name="extinct_since"
                  defaultValue={animal.extinct_since}
                />
              </p>
              <button className={css.editButton} type="submit">
                EDIT
              </button>
            </form>
            <button
              className={css.deleteButton}
              onClick={() => deleteAnimal(animal._id)}
            >
              DELETE
            </button>
          </li>
        ))}
      </ul>
      <div className={css.addAnimalWrapper}>
        <input
          className={css.listItemInput}
          type="text"
          name="hologram_name"
          value={newAnimal.hologram_name}
          onChange={handleChange}
          placeholder="Name"
        />
        <input
          className={css.listItemInput}
          type="text"
          name="weight"
          value={newAnimal.weight}
          onChange={handleChange}
          placeholder="Weight"
        />
        <input
          className={css.listItemInput}
          type="text"
          name="superpower"
          value={newAnimal.superpower}
          onChange={handleChange}
          placeholder="Super power"
        />
        <input
          className={css.listItemInput}
          type="text"
          name="extinct_since"
          value={newAnimal.extinct_since}
          onChange={handleChange}
          placeholder="Extinct since"
        />
        <button className={css.addButton} onClick={addAnimal}>
          ADD ANIMAL
        </button>
      </div>
      <ToastContainer />
    </div>
  );
};
