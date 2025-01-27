using System;
using System.Collections.Generic;
using System.IO.Ports;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Data;
using System.Windows.Documents;
using System.Windows.Input;
using System.Windows.Media;
using System.Windows.Media.Imaging;
using System.Windows.Navigation;
using System.Windows.Shapes;
using System.Windows.Threading;

namespace DMXDemoWpf
{
    /// <summary>
    /// Interaction logic for MainWindow.xaml
    /// </summary>
    public partial class MainWindow : Window
    {
        SerialPort _serialPort;
        byte[] _data;
        const int START_ADDRESS = 1;
        const int NUMBER_OF_DMX_BYTES = 513;
        DispatcherTimer _dispatcherTimer;

        private bool _partyMode = false;
        private DispatcherTimer _partyTimer;
        private Random _random = new Random();

        public MainWindow()
        {
            InitializeComponent();

            // Zoek alle COM-poorten op en vul ze in in de ComboBox.
            cbxPortName.Items.Add("None");
            foreach (string s in SerialPort.GetPortNames())
                cbxPortName.Items.Add(s);

            // Seriële poort aanmaken.
            _serialPort = new SerialPort();
            _serialPort.BaudRate = 250000;
            _serialPort.StopBits = StopBits.Two;

            // Maak het byte array.
            _data = new byte[NUMBER_OF_DMX_BYTES];

            // Timer maken en instellen.
            _dispatcherTimer = new DispatcherTimer();
            _dispatcherTimer.Interval = TimeSpan.FromSeconds(0.1);
            _dispatcherTimer.Tick += _dispatcherTimer_Tick;
            _dispatcherTimer.Start();

            // Party timer setup
            _partyTimer = new DispatcherTimer();
            _partyTimer.Interval = TimeSpan.FromMilliseconds(500);
            _partyTimer.Tick += _partyTimer_Tick;
        }

        // Maak een method om de DMX-data te versturen.
        private void SendDmxData(byte[] data, SerialPort serialPort)
        {
            data[0] = 0;

            if (serialPort != null && serialPort.IsOpen)
            {
                serialPort.BreakState = true;
                Thread.Sleep(1);
                serialPort.BreakState = false;
                Thread.Sleep(1);

                serialPort.Write(data, 0, data.Length);
            }
        }

        private void _dispatcherTimer_Tick(object sender, EventArgs e)
        {
            SendDmxData(_data, _serialPort);
        }

        private void cbxPortName_SelectionChanged(object sender, SelectionChangedEventArgs e)
        {
            if (_serialPort != null)
            {
                if (_serialPort.IsOpen)
                    _serialPort.Close();

                if (cbxPortName.SelectedItem.ToString() != "None")
                {
                    _serialPort.PortName = cbxPortName.SelectedItem.ToString();
                    _serialPort.Open();
                    sldrRed.IsEnabled = true;
                    sldrGreen.IsEnabled = true;
                    sldrBlue.IsEnabled = true;
                    sldrDim.IsEnabled = true;
                    btnPartyMode.IsEnabled = true;  // Enable party mode button
                }
                else
                {
                    sldrRed.IsEnabled = false;
                    sldrGreen.IsEnabled = false;
                    sldrBlue.IsEnabled = false;
                    sldrDim.IsEnabled = false;
                    btnPartyMode.IsEnabled = false;  // Disable party mode button
                }
            }
        }

        private void Slider_ValueChanged(object sender, RoutedPropertyChangedEventArgs<double> e)
        {
            // De zes bytes voor de LED Par instellen.
            _data[START_ADDRESS + 0] = Convert.ToByte(sldrRed.Value);
            _data[START_ADDRESS + 1] = Convert.ToByte(sldrGreen.Value);
            _data[START_ADDRESS + 2] = Convert.ToByte(sldrBlue.Value);
            _data[START_ADDRESS + 3] = Convert.ToByte(sldrDim.Value);
            _data[START_ADDRESS + 4] = 0;
            // LED Par2
            _data[START_ADDRESS + 5] = Convert.ToByte(sldrRed.Value);
            _data[START_ADDRESS + 6] = Convert.ToByte(sldrGreen.Value);
            _data[START_ADDRESS + 7] = Convert.ToByte(sldrBlue.Value);
            _data[START_ADDRESS + 8] = Convert.ToByte(sldrDim.Value);
            _data[START_ADDRESS + 9] = 0;
            // LED Par3
            _data[START_ADDRESS + 10] = Convert.ToByte(sldrRed.Value);
            _data[START_ADDRESS + 11] = Convert.ToByte(sldrGreen.Value);
            _data[START_ADDRESS + 12] = Convert.ToByte(sldrBlue.Value);
            _data[START_ADDRESS + 13] = Convert.ToByte(sldrDim.Value);
            _data[START_ADDRESS + 14] = 0;
            // LED Par4
            _data[START_ADDRESS + 15] = Convert.ToByte(sldrRed.Value);
            _data[START_ADDRESS + 16] = Convert.ToByte(sldrGreen.Value);
            _data[START_ADDRESS + 17] = Convert.ToByte(sldrBlue.Value);
            _data[START_ADDRESS + 18] = Convert.ToByte(sldrDim.Value);
            _data[START_ADDRESS + 19] = 0;
        }

        private void Window_Closing(object sender, System.ComponentModel.CancelEventArgs e)
        {
            _partyTimer.Stop();  // Add this line
            // Maak een nieuw byte array met 513 nullen en verstuur.
            SendDmxData(new byte[NUMBER_OF_DMX_BYTES], _serialPort);
            // Seriële poort vrijgeven.
            _serialPort.Dispose();
        }

        private void btnPartyMode_Click(object sender, RoutedEventArgs e)
        {
            _partyMode = !_partyMode;
            btnPartyMode.Content = $"Party Mode: {(_partyMode ? "On" : "Off")}";

            if (_partyMode)
            {
                sldrRed.IsEnabled = sldrGreen.IsEnabled = sldrBlue.IsEnabled = false;
                _partyTimer.Start();
            }
            else
            {
                sldrRed.IsEnabled = sldrGreen.IsEnabled = sldrBlue.IsEnabled = true;
                _partyTimer.Stop();
            }
        }

        private void _partyTimer_Tick(object sender, EventArgs e)
        {
            sldrRed.Value = _random.Next(256);
            sldrGreen.Value = _random.Next(256);
            sldrBlue.Value = _random.Next(256);
        }
    }
}
