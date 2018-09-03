import { Button } from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import AddIcon from '@material-ui/icons/Add';
import * as React from 'react';
import { users } from '../../MockData/users';
import { createUsersPresentationClasses, IUsersPresentationProps, IUsersPresentationState } from './Users.ias';

export class Users extends React.Component<IUsersPresentationProps, IUsersPresentationState> {
    public render() {
        const {
            fabButton,
        } = createUsersPresentationClasses(this.props, this.state);

        const mappedUsers = users.map(user => (
                <TableRow key={user.id}>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.type}</TableCell>
                </TableRow>
            )
        )

        return (
            <div>
                <Paper>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Full Name</TableCell>
                                <TableCell>Email</TableCell>
                                <TableCell>User Type</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {mappedUsers}
                        </TableBody>
                    </Table>
                </Paper>
                <Button
                    type="button'"
                    onClick={this.navigateToCreateUserPage}
                    variant="fab"
                    color="primary"
                    className={fabButton}>
                    <AddIcon/>
                </Button>
            </div>
        )
    }

    private navigateToCreateUserPage = () => {
        this.props.history.push(`${this.props.location.pathname}/createUser`);
    }
}