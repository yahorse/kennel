import Pet from '../models/Pet.js';

export const getPets = async (req, res, next) => {
  try {
    const pets = await Pet.find({ client: req.user._id }).sort('name');
    res.json(pets);
  } catch (error) {
    next(error);
  }
};

export const createPet = async (req, res, next) => {
  try {
    const pet = await Pet.create({ ...req.body, client: req.user._id });
    res.status(201).json(pet);
  } catch (error) {
    next(error);
  }
};

export const updatePet = async (req, res, next) => {
  try {
    const pet = await Pet.findOneAndUpdate(
      { _id: req.params.id, client: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!pet) {
      res.status(404);
      throw new Error('Pet not found');
    }

    res.json(pet);
  } catch (error) {
    next(error);
  }
};

export const deletePet = async (req, res, next) => {
  try {
    const pet = await Pet.findOneAndDelete({
      _id: req.params.id,
      client: req.user._id,
    });

    if (!pet) {
      res.status(404);
      throw new Error('Pet not found');
    }

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

export const getPetById = async (req, res, next) => {
  try {
    const pet = await Pet.findById(req.params.id).populate('client');
    if (!pet) {
      res.status(404);
      throw new Error('Pet not found');
    }

    res.json(pet);
  } catch (error) {
    next(error);
  }
};
