import React, { Component } from 'react';
import { FaGithubAlt, FaPlus, FaSpinner } from 'react-icons/fa';
import { Link } from 'react-router-dom';

import api from '../../services/api';
import Container from '../../components/Container';
import { Form, SubmitButton, List } from './styles';

export default class Main extends Component {
  state = {
    newRepo: '',
    repositories: [],
    loading: 0,
    notFound: false,
  };

  // carregar os dados do localstorage
  componentDidMount() {
    const repositories = localStorage.getItem('repositories');
    if (repositories) {
      this.setState({ repositories: JSON.parse(repositories) });
    }
  }

  // salvar os dados do localstore
  componentDidUpdate(_, prevState) {
    const { repositories } = this.state;
    if (prevState.repositories !== repositories) {
      localStorage.setItem('repositories', JSON.stringify(repositories));
    }
  }

  handleInputChange = e => {
    this.setState({ newRepo: e.target.value });
  };

  handleSubmit = async e => {
    e.preventDefault();

    this.setState({ loading: 1, notFound: false });

    const { newRepo, repositories } = this.state;

    try {
      const hasRepo = repositories.find(repo => repo.name === newRepo);

      if (hasRepo) throw 'Repositório duplicado';

      const response = await api.get(`/repos/${newRepo}`);
      const data = {
        name: response.data.full_name,
      };

      this.setState({
        repositories: [...repositories, data],
        newRepo: '',
        loading: 0,
      });
    } catch (error) {
      this.setState({
        loading: 0,
        notFound: true,
      });
    }
  };

  render() {
    const { newRepo, repositories, loading, notFound } = this.state;
    return (
      <Container>
        <h1>
          <FaGithubAlt />
          Repositórios
        </h1>
        <Form onSubmit={this.handleSubmit} notFound={notFound}>
          <input
            value={newRepo}
            onChange={this.handleInputChange}
            type="text"
            placeholder="Adicionar repositório"
          />
          <SubmitButton loading={loading}>
            {loading ? (
              <FaSpinner color="#FFF" size={14} />
            ) : (
              <FaPlus color="#FFF" size={14} />
            )}
          </SubmitButton>
        </Form>
        <List>
          {repositories.map(repositorie => (
            <li key={repositorie.name}>
              <span>{repositorie.name}</span>
              <Link to={`/repository/${encodeURIComponent(repositorie.name)}`}>
                Detalhes
              </Link>
            </li>
          ))}
        </List>
      </Container>
    );
  }
}
