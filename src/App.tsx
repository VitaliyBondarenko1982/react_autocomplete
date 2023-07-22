import React, {
  useState, ChangeEvent, useCallback, useMemo,
} from 'react';
import { peopleFromServer } from './data/people';
import { debounce } from './utils';
import { Person } from './types/Person';
import './App.scss';

export const App: React.FC = () => {
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');
  const [isDropdown, setIsDropdown] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);

  const applyQuery = useCallback(debounce(setAppliedQuery, 1000), []);

  const handleQueryChange = (event: ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    applyQuery(event.target.value);
  };

  const onFocus = () => {
    setIsDropdown(true);
  };

  const onBlur = () => {
    setTimeout(() => {
      setIsDropdown(false);
    }, 200);
  };

  const onSelect = (person: Person) => () => {
    setSelectedPerson(person);
  };

  const filteredPeople = useMemo(() => {
    if (!appliedQuery) {
      return peopleFromServer;
    }

    return peopleFromServer
      .filter(person => person.name.toLowerCase()
        .includes(appliedQuery.toLowerCase()));
  }, [appliedQuery]);

  return (
    <main className="section">
      <h1 className="title">
        {selectedPerson
          ? `${selectedPerson.name} (${selectedPerson?.born} - ${selectedPerson.died})`
          : 'No selected person'}
      </h1>

      <div className="dropdown is-active">
        <div className="dropdown-trigger">
          <input
            type="text"
            placeholder="Enter a part of the name"
            className="input"
            value={query}
            onChange={handleQueryChange}
            onFocus={onFocus}
            onBlur={onBlur}
          />
        </div>

        {isDropdown && (
          <div className="dropdown-menu" role="menu">
            <div className="dropdown-content">
              {filteredPeople.length ? filteredPeople.map((person) => (
                <div
                  className="dropdown-item"
                  key={person.slug}
                  onClick={onSelect(person)}
                  role="presentation"
                >
                  <p className="has-text-link">{person.name}</p>
                </div>
              )) : (
                <div
                  className="dropdown-item"
                >
                  <p className="has-text-link">No matching suggestions</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  );
};
