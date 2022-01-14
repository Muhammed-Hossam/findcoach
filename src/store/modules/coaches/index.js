import mutations from './mutations.js';
import getters from './getters.js';
import actions from './actions.js';

export default {
  namespaced: true,
  state() {
    return {
      lastFetch: null,
      coaches: [
        {
          id: 'c1',
          firstName: 'Mustafa',
          lastName: 'Omar',
          areas: ['frontend', 'backend', 'career'],
          description:
            "I'm Mustafa and I've worked as a freelance web developer for years. Let me help you become a developer as well!",
          hourlyRate: 30,
        },
        {
          id: 'c2',
          firstName: 'Mohamed',
          lastName: 'Haroun',
          areas: ['frontend', 'career'],
          description:
            'I am Mohamed and as a senior developer in a big tech company, I can help you get your first job or progress in your current role.',
          hourlyRate: 30,
        },
      ],
    };
  },
  mutations,
  getters,
  actions,
};
