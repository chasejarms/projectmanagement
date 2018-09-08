import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    TextField,
} from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import AddIcon from '@material-ui/icons/Add';
import * as React from 'react';
import { MockUsersApi } from '../../Api/Users/mockUsers';
import { IUser } from '../../Models/user';
import { handleChange } from '../../Utils/handleChange';
import { createUsersPresentationClasses, IUsersPresentationProps, IUsersPresentationState } from './Users.ias';

export class Users extends React.Component<IUsersPresentationProps, IUsersPresentationState> {
    public state = {
        open: false,
        newUserFullName: '',
        newUserEmail: '',
        newUserRole: 'Staff',
        users: [],
    };

    public handleChange = handleChange(this);

    public componentWillMount(): void {
        const users = new MockUsersApi().getUsers();
        this.setState({
            users,
        });
    }

    public render() {
        const {
            fabButton,
            dialogContent,
            dialogControl,
        } = createUsersPresentationClasses(this.props, this.state);

        const mappedUsers = this.state.users.map((user: IUser) => (
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
                    onClick={this.openNewUserDialog}
                    variant="fab"
                    color="primary"
                    className={fabButton}>
                    <AddIcon/>
                </Button>
                <Dialog
                    open={this.state.open}
                    onClose={this.handleClose}
                >
                    <DialogTitle>Create New User</DialogTitle>
                    <DialogContent className={dialogContent}>
                        <TextField
                            label="Full Name"
                            name="newUserFullName"
                            value={this.state.newUserFullName}
                            className={dialogControl}
                            onChange={this.handleChange}
                        />
                        <TextField
                            label="Email"
                            name="newUserEmail"
                            value={this.state.newUserEmail}
                            className={dialogControl}
                            onChange={this.handleChange}
                        />
                        <FormControl>
                            <InputLabel htmlFor="role">Role</InputLabel>
                            <Select
                                name="newUserRole"
                                className={dialogControl}
                                inputProps={{
                                    id: 'role',
                                }}
                                value={this.state.newUserRole}
                                onChange={this.handleChange}
                            >
                                <MenuItem value={'Admin'}>Admin</MenuItem>
                                <MenuItem value={'Staff'}>Staff</MenuItem>
                                <MenuItem value={'Customer'}>Customer</MenuItem>
                            </Select>
                        </FormControl>
                    </DialogContent>
                    <DialogActions>
                        <Button color="secondary" onClick={this.handleClose}>Cancel</Button>
                        <Button color="primary" onClick={this.handleSave}>Add User</Button>
                    </DialogActions>
                </Dialog>
            </div>
        )
    }

    private openNewUserDialog = () => {
        this.setState({ open: true });
    }

    private handleClose = () => {
        this.setState({
            open: false,
            newUserFullName: '',
            newUserEmail: '',
            newUserRole: 'Staff',
        });
    }

    private handleSave = () => {
        new MockUsersApi().addUser({
            name: this.state.newUserFullName,
            email: this.state.newUserEmail,
            type: this.state.newUserRole as any,
            id: '1',
            added: new Date(),
        })

        this.setState({
            open: false,
            newUserFullName: '',
            newUserEmail: '',
            newUserRole: 'Staff',
            users: new MockUsersApi().getUsers(),
        });
    }
}