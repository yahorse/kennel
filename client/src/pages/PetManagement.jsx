import { useEffect, useState } from 'react';

import httpClient from '../api/httpClient.js';

const initialFormState = {
  name: '',
  breed: '',
  weight_kg: '',
  feedingInstructions: '',
  medicationInstructions: '',
};

const PetManagement = () => {
  const [pets, setPets] = useState([]);
  const [formState, setFormState] = useState(initialFormState);
  const [loading, setLoading] = useState(false);

  const loadPets = async () => {
    setLoading(true);
    try {
      const { data } = await httpClient.get('/pets');
      setPets(data);
    } catch (error) {
      console.error('Failed to load pets', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPets();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await httpClient.post('/pets', {
        ...formState,
        weight_kg: formState.weight_kg ? Number(formState.weight_kg) : undefined,
      });
      setFormState(initialFormState);
      loadPets();
    } catch (error) {
      console.error('Failed to create pet', error);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <header>
        <h1 className="text-2xl font-semibold text-slate-800">Manage Pets</h1>
        <p className="mt-2 text-sm text-slate-500">Add or update your pet profiles to keep instructions current.</p>
      </header>

      <form className="grid grid-cols-1 gap-4 md:grid-cols-2" onSubmit={handleSubmit}>
        <label className="flex flex-col text-sm font-medium text-slate-600">
          Name
          <input
            type="text"
            value={formState.name}
            onChange={(event) => setFormState({ ...formState, name: event.target.value })}
            className="mt-1 rounded border border-slate-300 px-3 py-2"
            required
          />
        </label>
        <label className="flex flex-col text-sm font-medium text-slate-600">
          Breed
          <input
            type="text"
            value={formState.breed}
            onChange={(event) => setFormState({ ...formState, breed: event.target.value })}
            className="mt-1 rounded border border-slate-300 px-3 py-2"
          />
        </label>
        <label className="flex flex-col text-sm font-medium text-slate-600">
          Weight (kg)
          <input
            type="number"
            value={formState.weight_kg}
            onChange={(event) => setFormState({ ...formState, weight_kg: event.target.value })}
            className="mt-1 rounded border border-slate-300 px-3 py-2"
          />
        </label>
        <label className="flex flex-col text-sm font-medium text-slate-600 md:col-span-2">
          Feeding Instructions
          <textarea
            value={formState.feedingInstructions}
            onChange={(event) => setFormState({ ...formState, feedingInstructions: event.target.value })}
            className="mt-1 rounded border border-slate-300 px-3 py-2"
            rows={3}
          />
        </label>
        <label className="flex flex-col text-sm font-medium text-slate-600 md:col-span-2">
          Medication Instructions
          <textarea
            value={formState.medicationInstructions}
            onChange={(event) => setFormState({ ...formState, medicationInstructions: event.target.value })}
            className="mt-1 rounded border border-slate-300 px-3 py-2"
            rows={3}
          />
        </label>
        <div className="md:col-span-2 flex justify-end">
          <button type="submit" className="rounded bg-primary px-4 py-2 text-white shadow">
            Save Pet
          </button>
        </div>
      </form>

      <section>
        <h2 className="text-lg font-semibold text-slate-700">My Pets</h2>
        {loading ? (
          <p className="text-sm text-slate-500">Loading pets...</p>
        ) : (
          <div className="mt-3 grid grid-cols-1 gap-4 md:grid-cols-2">
            {pets.map((pet) => (
              <article key={pet._id} className="rounded border border-slate-200 p-4 text-sm">
                <h3 className="text-base font-semibold text-slate-700">{pet.name}</h3>
                <p className="text-slate-500">Breed: {pet.breed || 'Unknown'}</p>
                <p className="text-slate-500">Weight: {pet.weight_kg ? `${pet.weight_kg} kg` : 'N/A'}</p>
                <p className="text-slate-500">Feeding: {pet.feedingInstructions || 'N/A'}</p>
                <p className="text-slate-500">Medication: {pet.medicationInstructions || 'None'}</p>
              </article>
            ))}
            {pets.length === 0 && <p className="text-sm text-slate-500">No pets added yet.</p>}
          </div>
        )}
      </section>
    </div>
  );
};

export default PetManagement;
