import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#FDF6F0', // Soft background color
    },
    image: {
        width: 200,
        height: 200,
        alignSelf: 'center',
        marginVertical: 20,
    },
    welcomeText: {
        fontSize: 22,
        color: '#333333',
        textAlign: 'center',
        marginVertical: 10,
        fontWeight: '600',
    },
    input: {
        height: 48,
        borderRadius: 10,
        overflow: 'hidden',
        backgroundColor: 'white',
        marginTop: 10,
        marginBottom: 10,
        paddingLeft: 16,
        borderWidth: 1,
        borderColor: '#cccccc',
    },
    button: {
        backgroundColor: '#FF7F50',
        marginTop: 20,
        marginBottom: 20,
        height: 48,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonTitle: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    footerView: {
        flex: 1,
        alignItems: 'center',
        marginTop: 20,
    },
    footerText: {
        fontSize: 14,
        color: '#2e2e2d',
    },
    footerLink: {
        color: '#FF7F50',
        fontWeight: 'bold',
        fontSize: 14,
    },
});

export default styles;
