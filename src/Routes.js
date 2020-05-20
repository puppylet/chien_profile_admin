import React, { Component } from 'react'
import { Route, Switch } from 'react-router-dom'
import {asyncComponent} from './shared/libs/utils'

const Dashboard = asyncComponent(() => import('./shared/containers/Dashboard').then(module => module.default))
const ListUser = asyncComponent(() => import('./shared/containers/user/ListUser').then(module => module.default))
const EditUser = asyncComponent(() => import('./shared/containers/user/EditUser').then(module => module.default))
const CreateUser = asyncComponent(() => import('./shared/containers/user/CreateUser').then(module => module.default))
const CreateCompany = asyncComponent(() => import('./shared/containers/experience/CreateCompany').then(module => module.default))
const EditCompany = asyncComponent(() => import('./shared/containers/experience/EditCompany').then(module => module.default))
const CompanyList = asyncComponent(() => import('./shared/containers/experience/CompanyList').then(module => module.default))
const TechList = asyncComponent(() => import('./shared/containers/tech/TechList').then(module => module.default))
const EditTech = asyncComponent(() => import('./shared/containers/tech/EditTech').then(module => module.default))
const CreateTech = asyncComponent(() => import('./shared/containers/tech/CreateTech').then(module => module.default))
const Account = asyncComponent(() => import('./shared/containers/user/Account').then(module => module.default))
const ClientList = asyncComponent(() => import('./shared/containers/client/ClientList').then(module => module.default))
const CreateClient = asyncComponent(() => import('./shared/containers/client/CreateClient').then(module => module.default))
const EditClient = asyncComponent(() => import('./shared/containers/client/EditClient').then(module => module.default))
const ProjectList = asyncComponent(() => import('./shared/containers/project/ProjectList').then(module => module.default))
const CreateProject = asyncComponent(() => import('./shared/containers/project/CreateProject').then(module => module.default))
const EditProject = asyncComponent(() => import('./shared/containers/project/EditProject').then(module => module.default))
const ContactList = asyncComponent(() => import('./shared/containers/contact/ContactList').then(module => module.default))
const HiringList = asyncComponent(() => import('./shared/containers/hiring/HiringList').then(module => module.default))
const TestimonialList = asyncComponent(() => import('./shared/containers/testimonial/TestimonialList').then(module => module.default))

export default class Routes extends Component {
  render () {
    const {userInfo, avKey} = this.props
    return (
      <Switch>
        <Route exact path='/' component={Dashboard} />
        <Route path='/companies/list' component={CompanyList} />
        <Route path='/companies/new-company' component={CreateCompany} />
        <Route path='/companies/details/:id' component={EditCompany} />
        <Route path='/technologies/list' component={TechList} />
        <Route path='/technologies/details/:id' component={EditTech} />
        <Route path='/technologies/new-technology' component={CreateTech} />
        <Route path='/clients/list' component={ClientList} />
        <Route path='/clients/new-client' component={CreateClient} />
        <Route path='/clients/details/:id' component={EditClient} />
        <Route path='/projects/list' component={ProjectList} />
        <Route path='/projects/new-project' component={CreateProject} />
        <Route path='/projects/details/:id' component={EditProject} />
        <Route path='/users/list' component={ListUser} />
        <Route path='/contacts/list' component={ContactList} />
        <Route path='/hirings/list' component={HiringList} />
        <Route path='/testimonials/list' component={TestimonialList} />
        <Route path='/users/new-user' component={CreateUser} />
        <Route path='/users/details/:id' render={() => <EditUser avKey={avKey} userInfo={userInfo} changeMe={this.props.changeMe} />} />
        <Route path='/account' render={() => <Account avKey={avKey} userInfo={userInfo} changeMe={this.props.changeMe} />} />
      </Switch>
    )
  }
}
