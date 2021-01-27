
/*
 hicbit_control package
*/
//% weight=10 icon="\uf2c5" color=#7CCD7C
namespace hicbit_control {

    export enum hicbit_key {
        //% block="up"
        up = 0x01,
        //% block="down"
        down = 0x02,
        //% block="left"
        left = 0x03,
        //% block="right"
        right = 0x04
    }
    
    /**
     * hicbit initialization, please execute at boot time
    */
    //% weight=100 blockGap=20 blockId=hicbit_Init block="Initialize hicbit"
    export function hicbit_Init() {
        let buf = pins.createBuffer(10);
        led.enable(false);

        serial.redirect(
            SerialPin.P8,
            SerialPin.P12,
            BaudRate.BaudRate115200);

        /*basic.forever(() => {
            getHandleCmd();
        });*/

        buf[0] = 0xDD;//地址位::显示器
	buf[1] = 0x09;//控制位::清空指令；记录LCD显示的数据是在microbit；所以每次启动都会进行一次刷新，再重新写入数据到显示
        serial.writeBuffer(buf);
	serial.writeString(Display.NEW_LINE);
        basic.pause(500);//留给显示器更新的时间
        //Display.Clearscreen();
        //basic.pause(500);
    }

    //let handleCmd: string = "";
    
    /**
    * Get the handle command.
    */
	/*
    function getHandleCmd() {
        let charStr: string = serial.readString();
        handleCmd = handleCmd.concat(charStr);
        handleCmd = "";
    }
	*/

    /**
     * Pause for the specified time in seconds
     * @param s how long to pause for, eg: 1, 2, 5, 10, 20,
     */
    //% weight=90
    //% block="wait(s) %s"
    //% blockId=wait_s
    export function wait_s(s:number) {
        basic.pause(s*1000);
    }

    /**
     * Pause for the specified time in milliseconds
     * @param ms how long to pause for, eg: 100, 200, 500
     */
    //% weight=89
    //% block="wait(ms) %ms"
    //% blockId=wait_ms
    export function wait_ms(ms:number) {
        basic.pause(ms);
    }

    /**
    * Set the arrow keys
    */
    //% weight=99 blockId=hicbit_Arrowkeys block="Arrow keys are|key %key"
    export function hicbit_Arrowkeys(key: hicbit_key): boolean {
        let status = 0;
        let flag: boolean = false;
        switch (key) {
            case hicbit_key.up:
                pins.setPull(DigitalPin.P5, PinPullMode.PullUp);
                status = pins.digitalReadPin(DigitalPin.P5);
                break;
            case hicbit_key.down:
                pins.setPull(DigitalPin.P6, PinPullMode.PullUp);
                status = pins.digitalReadPin(DigitalPin.P6);
                break;
            case hicbit_key.left:
                pins.setPull(DigitalPin.P7, PinPullMode.PullUp);
                status = pins.digitalReadPin(DigitalPin.P7);
                break;
            case hicbit_key.right:
                pins.setPull(DigitalPin.P9, PinPullMode.PullUp);
                status = pins.digitalReadPin(DigitalPin.P9);
                break;
        }
        if (status == 1)
            flag = false;
        else
            flag = true;
        return flag;
    }

}


/*
 hicbit package
*/
//% weight=9 icon="\uf180" color=#5F9EA0
namespace hicbit {

    export let NEW_LINE = "\r\n";

    export enum hicbit_Port {
        //% block="port A"
        port1 = 0x01,
        //% block="port B"
        port2 = 0x02,
        //% block="port C"
        port3 = 0x03,
        //% block="Port D"
        port4 = 0x04
    }

    export enum hicbit_Features {
        //% block="start_up"
        start_up = 0x01,
        //% block="stop"
        stop = 0x02,
        //% block="time(s)"
        time = 0x03,
        /*
	//% block="number_of_turns"
        number_of_turns = 0x04,
        //% block="angle"
        angle = 0x05,
        */
    }

    export enum hicbit_Coded_motor_Port {
        //% block="port A"
        port1 = 0x01,
        //% block="port B"
        port2 = 0x02,
        //% block="port C"
        port3 = 0x03,
        //% block="port D"
        port4 = 0x04,
    }

    export enum Coded_motor_speed {
        //% block="fast"
        fast = 0xff,
        //% block="Medium"
        Medium = 0x80,
        //% block="slow"
        slow = 0x40,
    }

    /**
    *	Set interface motor speed , range of -255~255, that can control turn.etc.
    */
    //% weight=99 blockId=hicbit_set_Single_motor block="Set |port %port| motor|speed %speed| |Features %Features|: |%content|"
    //% speed.min=-100 speed.max=100 
    //% inlineInputMode=inline
    export function hicbit_set_Single_motor(port: hicbit_Port, speed: number, Features: hicbit_Features, content: number) 
    {
               //启动变量
        let direction: number = 0;
        let buf = pins.createBuffer(30);

        //时间变量
        let time2: number = 0;
        let buf2 = pins.createBuffer(30);

        //角度变量
        let angle: number = 0 ;     //角度值
        let buf3 = pins.createBuffer(30);

        //圈数变量
        let num_of_turn: number = 0 ;

        if(speed<0){
            direction=0x02;
            speed=-speed
        }else if(speed==0x00){
            direction=0x00
            speed=speed
        }
        else{
            direction=0x01
            speed=speed
        }
        
        if (Features == 1)                   //启动
        {

            buf[0] = 0x58;      //标志位
            buf[1] = direction
            buf[2] = speed
            buf[3] = 0x00;
            buf[4] = port;
	    buf[5] = 0x0d;
	    buf[6] = 0x0a;
            serial.writeBuffer(buf);
	    //serial.writeString(NEW_LINE);

        }

        if(Features == 2)                   //停止
        { 

            buf[0] = 0x58;           //标志位
            buf[1] = 0x00;              //停止单电机
            buf[2] = 0x00
            buf[3] = 0x00
            buf[4] = port;
            buf[5] = 0x0d;
	    buf[6] = 0x0a;
            serial.writeBuffer(buf);
            //serial.writeString(NEW_LINE);
            
        }

        if (Features == 3) {         //时间
            
                time2 = content ;
                //basic.pause(time2);
                
                buf2[0] = 0x58;         //标志位
                buf2[1] = direction;            //停止单电机
                buf2[2] = speed;
                buf2[3] = time2;
                buf2[4] = port;
		buf2[5] = 0x0d;
		buf2[6] = 0x0a;
                serial.writeBuffer(buf2);
                //serial.writeString(NEW_LINE); 
        }
        basic.pause(100);
    }

    /**
    *	Set interface motor1 and motor2 speed , range of -255~255, that can control turn.etc.
    *   @param port1 First port, eg: hicbit.hicbit_Port.port1
    *   @param port2 The second port, eg: hicbit.hicbit_Port.port2
    */
    //% weight=98 blockId=hicbit_set_Dual_motor block="Set |port %port1| motor |speed %speed1| and |port %port2| motor |speed %speed2| |Features %Features|"
    //% speed1.min=-100 speed1.max=100 
    //% speed2.min=-100 speed2.max=100 
    //% inlineInputMode=inline
    export function hicbit_set_Dual_motor(port1: hicbit_Port, speed1: number,port2: hicbit_Port, speed2: number, Features: hicbit_Features) {
        //启动变量
        let buf = pins.createBuffer(30);
	let direction1,direction2:number=0;
	if(speed1>0)direction1=1;
	 else if(speed1<0)direction1=2;
	 else direction1=0;
	if(speed2>0)direction2=1;
	 else if(speed2<0)direction2=2;
	 else direction2=0; 
   	
	 if(Features==1){
            buf[0] = 0x6D;      //标志位
            buf[1] = port1;
            buf[2] = direction1;
            buf[3] = speed1;
            buf[4] = port2;
            buf[5] = direction2;
	    buf[6] = speed2;
	    buf[7] = 0x0d;
            buf[8] = 0x0a;
            serial.writeBuffer(buf);
	 }else if(Features==2){
	    buf[0] = 0x6D;      //标志位
            buf[1] = port1;
            buf[2] = direction1;
            buf[3] = 0;
            buf[4] = port2;
            buf[5] = direction2;
	    buf[6] = 0;
	    buf[7] = 0x0d;
            buf[8] = 0x0a;
            serial.writeBuffer(buf);
	 
	 }
        basic.pause(100);

    }

/**
 * 
 * @param port1 
 * @param speed1 
 * @param port2 
 * @param speed2 
 * @param port3 
 * @param speed3 
 * @param Features 
 * @param content 
 */
    //% weight=98 blockId=hicbit_setTripleMotor block="Set |port %port1| motor |speed %speed1| and |port %port2| motor |speed %speed2| and |port %port3| motor |speed %speed3| |Features %Features|"
    //% speed1.min=-100 speed1.max=100 
    //% speed2.min=-100 speed2.max=100
    //% speed3.min=-100 speed3.max=100
    //% inlineInputMode=inline
    export function hicbit_setTripleMotor(port1: hicbit_Port, speed1: number,port2: hicbit_Port, speed2: number, port3:hicbit_Port,speed3:number,Features: hicbit_Features)
    {
        let direction1:number
        let direction2:number
        let direciton3:number
        let buf = pins.createBuffer(30)
	let content=0;
        if(speed1>0)
        {
            direction1=0x01
        }else if(speed1<0)
        {
            direction1=0x02
        }else 
        {
            direction1=0x00
        }

        if(speed2>0)
        {
            direction2=0x01
        }else if(speed2<0)
        {
            direction2=0x02
        }else 
        {
            direction2=0x00
        }
        if(speed3>0)
        {
            direciton3=0x01
        }else if(speed3<0)
        {
            direciton3=0x02
        }else 
        {
            direciton3=0x00
        }


        if(Features==1)
        {
             buf[0] = 0x6E //控制位
             buf[1] = direction1
             buf[2] = port1 
             buf[3] = speed1 //速度or角度
             buf[4] = direction2 
             buf[5] = port2
             buf[6] = speed2 // 速度or角度
             buf[7] = direciton3
             buf[8] = port3
             buf[9] = speed3
             buf[10] = content
             buf[11] = 0x00 // 0 速度控制 ； // 1.停止//2.时间  // 时间

        }
        if(Features==2)
        {
             content*=1000
             buf[0] = 0x6E //控制位
             buf[1] = direction1
             buf[2] = port1 
             buf[3] = speed1 //速度or角度
             buf[4] = direction2 
             buf[5] = port2
             buf[6] = speed2 // 速度or角度
             buf[7] = direciton3
             buf[8] = port3
             buf[9] = speed3
             buf[10] = content
             buf[11] = 0x01 // 0 速度控制 ； // 1.停止//2.时间  // 时间

        }
        if(Features==3)
        {
            buf[0] = 0x6E //控制位
             buf[1] = direction1
             buf[2] = port1 
             buf[3] = speed1 //速度or角度
             buf[4] = direction2 
             buf[5] = port2
             buf[6] = speed2 // 速度or角度
             buf[7] = direciton3
             buf[8] = port3
             buf[9] = speed3
             buf[10] = content
             buf[11] = 0x02 // 0 速度控制 ； // 1.停止//2.时间  // 时间
        }
	    buf[12]=0x0d;
	    buf[13]=0x0a;
	serial.writeBuffer(buf);
        basic.pause(100);
    }

    /**
     * 
     * @param port1 
     * @param speed1 
     * @param port2 
     * @param speed2 
     * @param port3 
     * @param speed3 
     * @param port4 
     * @param speed4 
     * @param Features 
     * @param content 
     */
    //% weight=98 blockId=hicbit_set4Motor block="Set |port %port1| motor |speed %speed1| and |port %port2| motor |speed %speed2| and |port %port3| motor |speed %speed3| and |port %port4| motor |speed %speed4| |Features %Features|: |%content|"
    //% speed1.min=-100 speed1.max=100 
    //% speed2.min=-100 speed2.max=100
    //% speed3.min=-100 speed3.max=100
    //% speed4.min=-100 speed4.max=100
    //% inlineInputMode=inline
    export function hicbit_set4Motor(port1: hicbit_Port, speed1: number,port2: hicbit_Port, speed2: number, port3:hicbit_Port,speed3:number,port4:hicbit_Port,speed4:number,Features: hicbit_Features, content: number)
    {
        let direction1:number
        let direction2:number
        let direciton3:number
        let direciton4:number
        let buf = pins.createBuffer(255)

        if(speed1>0)
        {
            direction1=0x01
        }else if(speed1<0)
        {
            direction1=0x02
        }else 
        {
            direction1=0x00
        }

        if(speed2>0)
        {
            direction2=0x01
        }else if(speed2<0)
        {
            direction2=0x02
        }else 
        {
            direction2=0x00
        }
        if(speed3>0)
        {
            direciton3=0x01
        }else if(speed3<0)
        {
            direciton3=0x02
        }else 
        {
            direciton3=0x00
        }

        if(speed4>0)
        {
            direciton4=0x01
        }else if(speed4<0)
        {
            direciton4=0x02
        }else 
        {
            direciton4=0x00
        }



        if(Features==1)
        {
             buf[0] = 0x6F //控制位
             buf[1] = direction1
             buf[2] = port1 
             buf[3] = speed1 //速度or角度
             buf[4] = direction2 
             buf[5] = port2
             buf[6] = speed2 // 速度or角度
             buf[7] = direciton3
             buf[8] = port3
             buf[9] = speed3
             buf[10] = direciton4
             buf[11] = port4
             buf[12] = speed4
             buf[13] = content
             buf[14] = 0x00 // 0 速度控制 ； // 1.停止//2.时间  // 时间

        }
        if(Features==2)
        {
             buf[0] = 0x6F //控制位
             buf[1] = direction1
             buf[2] = port1 
             buf[3] = speed1 //速度or角度
             buf[4] = direction2 
             buf[5] = port2
             buf[6] = speed2 // 速度or角度
             buf[7] = direciton3
             buf[8] = port3
             buf[9] = speed3
             buf[10] = direciton4
             buf[11] = port4
             buf[12] = speed4
             buf[13] = content
             buf[14] = 0x01 // 0 速度控制 ； // 1.停止//2.时间  // 时间

        }
        if(Features==3)
        {

             buf[0] = 0x6F //控制位
             buf[1] = direction1
             buf[2] = port1 
             buf[3] = speed1 //速度or角度
             buf[4] = direction2 
             buf[5] = port2
             buf[6] = speed2 // 速度or角度
             buf[7] = direciton3
             buf[8] = port3
             buf[9] = speed3
             buf[10] = direciton4
             buf[11] = port4
             buf[12] = speed4
             buf[13] = content
             buf[14] = 0x02 // 0 速度控制 ； // 1.停止//2.时间  // 时间
        }
	    buf[15]=0x0d;
	    buf[16]=0x0a;
	    serial.writeBuffer(buf);
        basic.pause(100);

    }
	/**
	*
	* @param port1
	* @param angle1
	* @param speed1
	* @param bias1
	* @param port2
	* @param angle2
	* @param speed2
	* @param bias2
	*/
	//% weight=98 blockId=HTMAC block="set |port %port1| motor|angle %angle1|and |speed %speed1|and |bias %bias1| and |port %port2| motor|angle %angle2|and |speed %speed2|and |bias %bias2|"
	//% angle1.min=0
	//% angle2.min=0
	//% speed1.min=-100 speed1.max=100
	//% speed2.min=-100 speed2.max=100
	//% inlineInputMode=inline
	export function HTMAC(port1:hicbit_Port,angle1:number,speed1:number,bias1:number,port2:hicbit_Port,angle2:number,speed2:number,bias2:number){
		let direction1:number=0;
		let direction2:number=0;
		let angle_H1,angle_L1,angle_H2,angle_L2;
		let buf=pins.createBuffer(30);
		angle1+=bias1;
		angle2+=bias2;
		if(speed1<0)direction1=0x02;
		else if(speed1==0)direction1=0x00;
		else direction1=0x01;
		
		if(speed2<0)direction2=0x02;
		else if(speed2==0)direction2=0x00;
		else direction2=0x01;
		angle_H1 = angle1 / 0xff;
        	angle_L1 = angle1 % 0xff;
		angle_H2 = angle2 / 0xff;
        	angle_L2 = angle2 % 0xff;
		
		buf[0]=0x61;//双角度同步执行
		buf[1]=port1;
		buf[2]=direction1;
		buf[3]=angle_H1;
		buf[4]=angle_L1;
		buf[5]=speed1;
		buf[6]=port2;
		buf[7]=direction2;
		buf[8]=angle_H2;
		buf[9]=angle_L2;
		buf[10]=speed2;
		buf[11]=0x0d;
		buf[12]=0x0a;
		serial.writeBuffer(buf);
        	basic.pause(100);//等待串口发送完毕
	}

	
	/**
	*
	* @param port1
	* @param angle1
	* @param speed1
	* @param bias1
	* @param port2
	* @param angle2
	* @param speed2
	* @param bias2
	* @param port3
	* @param angle3
	* @param speed3
	* @param bias3
	*/
	//% weight=98 blockId=HTreeMAC block="set |port %port1| motor|angle %angle1|and |speed %speed1|and |bias %bias1| and |port %port2| motor|angle %angle2|and |speed %speed2|and |bias %bias2|and |port %port3| motor|angle %angle3|and |speed %speed3|and |bias %bias3|"
	//% angle1.min=0
	//% angle2.min=0
	//% angle3.min=0
	//% speed1.min=-100 speed1.max=100
	//% speed2.min=-100 speed2.max=100
	//% speed3.min=-100 speed3.max=100
	//% inlineInputMode=inline
	export function HTreeMAC(port1:hicbit_Port,angle1:number,speed1:number,bias1:number,port2:hicbit_Port,angle2:number,speed2:number,bias2:number,port3:hicbit_Port,angle3:number,speed3:number,bias3:number){
		let direction1:number=0;
		let direction2:number=0;
		let direction3:number=0;
		let angle_H1,angle_L1,angle_H2,angle_L2,angle_H3,angle_L3;
		let buf=pins.createBuffer(30);
		angle1+=bias1;
		angle2+=bias2;
		angle3+=bias3;
		if(speed1<0)direction1=0x02;
		else if(speed1==0)direction1=0x00;
		else direction1=0x01;
		
		if(speed2<0)direction2=0x02;
		else if(speed2==0)direction2=0x00;
		else direction2=0x01;
		
		if(speed3<0)direction3=0x02;
		else if(speed3==0)direction3=0x00;
		else direction3=0x01;
		
		angle_H1 = angle1 / 0xff;
        	angle_L1 = angle1 % 0xff;
		angle_H2 = angle2 / 0xff;
        	angle_L2 = angle2 % 0xff;
		angle_H3 = angle3 / 0xff;
        	angle_L3 = angle3 % 0xff;
		
		buf[0]=0x60;//双角度同步执行
		buf[1]=port1;
		buf[2]=direction1;
		buf[3]=angle_H1;
		buf[4]=angle_L1;
		buf[5]=speed1;
		buf[6]=port2;
		buf[7]=direction2;
		buf[8]=angle_H2;
		buf[9]=angle_L2;
		buf[10]=speed2;
		buf[11]=port3;
		buf[12]=direction3;
		buf[13]=angle_H3;
		buf[14]=angle_L3;
		buf[15]=speed3;
		buf[16]=0x0d;
		buf[17]=0x0a;
		serial.writeBuffer(buf);
        	basic.pause(100);//等待串口发送完毕
	}
	
	/**
	*
	* @param port1
	* @param angle1
	* @param speed1
	* @param bias1
	* @param port2
	* @param angle2
	* @param speed2
	* @param bias2
	* @param port3
	* @param angle3
	* @param speed3
	* @param bias3
	* @param port4
	* @param angle4
	* @param speed4
	* @param bias4
	*/
	//% weight=98 blockId=HFMAC block="set |port %port1| motor|angle %angle1|and |speed %speed1|and |bias %bias1| and |port %port2| motor|angle %angle2|and |speed %speed2|and |bias %bias2|and |port %port3| motor|angle %angle3|and |speed %speed3|and |bias %bias3|and |port %port4| motor|angle %angle4|and |speed %speed4|and |bias %bias4|"
	//% angle1.min=0
	//% angle2.min=0
	//% angle3.min=0
	//% angle4.min=0
	//% speed4.min=-100 speed4.max=100
	//% speed1.min=-100 speed1.max=100
	//% speed2.min=-100 speed2.max=100
	//% speed3.min=-100 speed3.max=100
	//% inlineInputMode=inline
	export function HFMAC(port1:hicbit_Port,angle1:number,speed1:number,bias1:number,port2:hicbit_Port,angle2:number,speed2:number,bias2:number,port3:hicbit_Port,angle3:number,speed3:number,bias3:number,port4:hicbit_Port,angle4:number,speed4:number,bias4:number){
		let direction1:number=0;
		let direction2:number=0;
		let direction3:number=0;
		let direction4:number=0;
		let angle_H1,angle_L1,angle_H2,angle_L2,angle_H3,angle_L3,angle_H4,angle_L4;
		let buf=pins.createBuffer(30);
		angle1+=bias1;
		angle2+=bias2;
		angle3+=bias3;
		angle4+=bias4;
		if(speed1<0)direction1=0x02;
		else if(speed1==0)direction1=0x00;
		else direction1=0x01;
		
		if(speed2<0)direction2=0x02;
		else if(speed2==0)direction2=0x00;
		else direction2=0x01;
		
		if(speed3<0)direction3=0x02;
		else if(speed3==0)direction3=0x00;
		else direction3=0x01;
		
		angle_H1 = angle1 / 0xff;
        	angle_L1 = angle1 % 0xff;
		angle_H2 = angle2 / 0xff;
        	angle_L2 = angle2 % 0xff;
		angle_H3 = angle3 / 0xff;
        	angle_L3 = angle3 % 0xff;
		
		buf[0]=0x62;//双角度同步执行
		buf[1]=port1;
		buf[2]=direction1;
		buf[3]=angle_H1;
		buf[4]=angle_L1;
		buf[5]=speed1;
		buf[6]=port2;
		buf[7]=direction2;
		buf[8]=angle_H2;
		buf[9]=angle_L2;
		buf[10]=speed2;
		buf[11]=port3;
		buf[12]=direction3;
		buf[13]=angle_H3;
		buf[14]=angle_L3;
		buf[15]=speed3;
		buf[16]=port4;
		buf[17]=direction4;
		buf[18]=angle_H4;
		buf[19]=angle_L4;
		buf[20]=speed4;
		buf[21]=0x0d;
		buf[22]=0x0a;
		serial.writeBuffer(buf);
        	basic.pause(100);//等待串口发送完毕
	}
	
/**
 * 
 * @param port
 * @param angle 
 * @param speed 
 * @param bias 
 */
 //% weight=98 blockId=hicbit_setSingleangleMotor block="Set |port %port| motor|angle %angle| and|speed %speed| and|bias %bias|"
 //% angle.min=-360 angle.max=360
 //% speed.min=-100 speed.max=100
 //% bias.min=-100 bias.max=100
 //% inlineInputMode=inline
 export function hicbit_setSingleangleMotor(port:hicbit_Coded_motor_Port,angle:number,speed:number,bias:number){
 	let direction: number = 0;
	let angle_H, angle_L; 
	let status;
        let buf = pins.createBuffer(30);
	 angle=angle+bias;
        if(angle<0){
            direction=0x02;

        }else if(angle==0x00){
            direction=0x00
        }
        else{
            direction=0x01
        }
        
	angle_H = angle / 0xff;
        angle_L = angle % 0xff;
	

        buf[0] = 0x59;      //标志位
        buf[1] = direction
        buf[2] = angle_H;
        buf[3] = angle_L;
        buf[4] = port;
	buf[5] = speed;
	buf[6] = 0x0d;
	buf[7] = 0x0a;
        serial.writeBuffer(buf);
        basic.pause(100);//等待串口发送完毕
 }
	
    /**
    *	Set Coded motor , angle of -360~360, that can control turn.
    */
    //% weight=97 blockId=hicbit_setCodedmotor block="Set |port %port| motor|angle %angle| speed|speed %speed|  "
    //% angle.min=-360 angle.max=360
    //% inlineInputMode=inline
    export function hicbit_setCodedmotor(port: hicbit_Coded_motor_Port,angle: number,speed:number) {
        let direction: number = 0;
	let angle_H, angle_L; 
	let status;
        let buf = pins.createBuffer(30);
        if(angle<0){
            direction=0x02;

        }else if(angle==0x00){
            direction=0x00
        }
        else{
            direction=0x01
        }
        
	angle_H = angle / 0xff;
        angle_L = angle % 0xff;
	

        buf[0] = 0x59;      //标志位
        buf[1] = direction
        buf[2] = angle_H;
        buf[3] = angle_L;
        buf[4] = port;
	buf[5] = speed;
	buf[6] = 0x0d;
	buf[7] = 0x0a;
        serial.writeBuffer(buf);
        basic.pause(100);//等待串口发送完毕
    }

}


/*
 Sensor package
*/
//% weight=8 icon="\uf2db" color=#8470FF
namespace Sensor {
    
    export enum hicbit_Port {
        //% block="port 1"
        port1 = 0x01,
        //% block="port 2"
        port2 = 0x02,
        //% block="port 3"
        port3 = 0x03,
        //% block="Port 4"
        port4 = 0x04
    }

    export enum enRocker {
        //% blockId="Nostate" block="无"
        Nostate = 0,
        //% blockId="Up" block="上"
        Up,
        //% blockId="Down" block="下"
        Down,
        //% blockId="Left" block="左"
        Left,
        //% blockId="Right" block="右"
        Right,
    }

    export enum Dht11Result {
        //% block="Celsius"
        Celsius,
        //% block="Fahrenheit"
        Fahrenheit,
        //% block="humidity"
        humidity
    }


     export enum buz {
        //% block="ring"
        ring = 0x01,
        //% block="Not_ringing"
        Not_ringing = 0x02,
    }

    /**
     * 
     * @param port [port1,port2,port3,port4] choose ports
     * @param value [0-1] set buzzer open or close
     */
    //% blockID=testBLOCY block="Buzzer port |%port| value |%value|"
    //% weight = 100
    //% value.min=0 value.max=1
   export function testBLOCY(port:hicbit_Port , value:number):void{
        if(port==hicbit_Port.port1)
        switch(value){
                case 1:
                    pins.digitalWritePin(DigitalPin.P1, 1);
                    break;
                case 0:
                    pins.digitalWritePin(DigitalPin.P1, 0);
                    break;
                
        }
        if(port==hicbit_Port.port2)
        switch(value)
        {
            case 1:
                pins.digitalWritePin(DigitalPin.P2, 1);
                break;
            case 0:
                pins.digitalWritePin(DigitalPin.P2, 0);
                break;
            
        }
        if(port==hicbit_Port.port3)
        switch(value){
            case 1:
                pins.digitalWritePin(DigitalPin.P3, 1);
                break;
            case 0:
                pins.digitalWritePin(DigitalPin.P3, 0);
                break;
            
        }
        if(port==hicbit_Port.port4)
        switch(value){
            case 1:
                pins.digitalWritePin(DigitalPin.P4, 1);
                break;
            case 0:
                pins.digitalWritePin(DigitalPin.P4, 0);
                break;
            
        }
    }
 
    /**
     * Get the line follower sensor port ad value 巡线
     */
    //% weight=99 blockId=hicbit_lineSensorValue block="Get line follower sensor Value|port %port|value(0~255)"
    export function hicbit_lineSensorValue(port: hicbit_Port): number {
        let ADCPin: AnalogPin;
        switch (port) {
            case hicbit_Port.port1:
                ADCPin = AnalogPin.P1;
                break;
            case hicbit_Port.port2:
                ADCPin = AnalogPin.P2;
                break;
            case hicbit_Port.port3:
                ADCPin = AnalogPin.P3;
                break;
            case hicbit_Port.port4:
                ADCPin = AnalogPin.P4;
                break;
        }
        let adValue = pins.analogReadPin(ADCPin);
        adValue = adValue * 255 / 1023;
        return Math.round(adValue);
    }

    let distanceBak = 0;
    /**
     * Get the distance of ultrasonic detection to the obstacle 超声波
     */
    //% weight=98 blockId=hicbit_ultrasonic  block="Ultrasonic|port %port|distance(cm)"
    export function hicbit_ultrasonic(port: hicbit_Port): number {
        let echoPin: DigitalPin;
        let trigPin: DigitalPin;
        switch (port) {
            case hicbit_Port.port1:
                echoPin = DigitalPin.P15;
                trigPin = DigitalPin.P1;
                break;
            case hicbit_Port.port2:
                echoPin = DigitalPin.P13;
                trigPin = DigitalPin.P2;
                break;
            case hicbit_Port.port3:
                echoPin = DigitalPin.P14;
                trigPin = DigitalPin.P3;
                break;
            case hicbit_Port.port4:
                echoPin = DigitalPin.P10;
                trigPin = DigitalPin.P4;
                break;
        }
        pins.setPull(echoPin, PinPullMode.PullNone);
        pins.setPull(trigPin, PinPullMode.PullNone);

        pins.digitalWritePin(trigPin, 0);
        control.waitMicros(2);
        pins.digitalWritePin(trigPin, 1);
        control.waitMicros(10);
        pins.digitalWritePin(trigPin, 0);
        control.waitMicros(5);
        let d = pins.pulseIn(echoPin, PulseValue.High, 25000);
        let distance = d;
        // filter timeout spikes
        if (distance == 0 && distanceBak != 0) {
            distance = distanceBak;
        }
        distanceBak = d;
        return Math.round(distance * 10 / 6 / 58);
    }

    /**
    * Get the ad value of the knob moudule 旋钮
    */
    //% weight=97 blockId=hicbit_getKnobValue  block="Get knob|port %port|value(0~255)"
    export function hicbit_getKnobValue(port: hicbit_Port): number {
        let ADCPin: AnalogPin;
        switch (port) {
            case hicbit_Port.port1:
                ADCPin = AnalogPin.P1;
                break;
            case hicbit_Port.port2:
                ADCPin = AnalogPin.P2;
                break;
            case hicbit_Port.port3:
                ADCPin = AnalogPin.P3;
                break;
            case hicbit_Port.port4:
                ADCPin = AnalogPin.P4;
                break;
        }
        let adValue = pins.analogReadPin(ADCPin);
        adValue = adValue * 255 / 1023;
        return Math.round(adValue);
    }

    /**
    * Get the ad value of the photosensitive moudule 光敏AD
    */
    //% weight=96 blockId=hicbit_getphotosensitiveValue  block="Get Photosensitive|port %port|value(0~255)"
    export function hicbit_getphotosensitiveValue(port: hicbit_Port): number {
        let ADCPin: AnalogPin;
        switch (port) {
            case hicbit_Port.port1:
                ADCPin = AnalogPin.P1;
                break;
            case hicbit_Port.port2:
                ADCPin = AnalogPin.P2;
                break;
            case hicbit_Port.port3:
                ADCPin = AnalogPin.P3;
                break;
            case hicbit_Port.port4:
                ADCPin = AnalogPin.P4;
                break;
        }
        let adValue = pins.analogReadPin(ADCPin);
        adValue = adValue * 255 / 1023;
        return 255 - Math.round(adValue);
    }

    /**
    * Get the Photosensitive sensor status,1 detect bright,0 no detect bright 光敏
    */
    //% weight=95 blockId=hicbit_photosensitiveSensor block="Photosensitive sensor|port %port|detect bright"
    export function hicbit_photosensitiveSensor(port: hicbit_Port): boolean {
        let status = 0;
        let flag: boolean = false;
        switch (port) {
            case hicbit_Port.port1:
                pins.setPull(DigitalPin.P15, PinPullMode.PullUp);
                status = pins.digitalReadPin(DigitalPin.P15);
                break;
            case hicbit_Port.port2:
                pins.setPull(DigitalPin.P13, PinPullMode.PullUp);
                status = pins.digitalReadPin(DigitalPin.P13);
                break;
            case hicbit_Port.port3:
                pins.setPull(DigitalPin.P14, PinPullMode.PullUp);
                status = pins.digitalReadPin(DigitalPin.P14);
                break;
            case hicbit_Port.port4:
                pins.setPull(DigitalPin.P10, PinPullMode.PullUp);
                status = pins.digitalReadPin(DigitalPin.P10);
                break;
        }
        if (status == 1)
            flag = false;
        else
            flag = true;
        return flag;
    }

    /**
    * Get the ad value of the avoid Sensor moudule 避障AD
    */
    //% weight=94 blockId=hicbit_getavoidSensorValue  block="Get avoid Sensor Value|port %port|value(0~255)"
    export function hicbit_getavoidSensorValue(port: hicbit_Port): number {
        let ADCPin: AnalogPin;
        switch (port) {
            case hicbit_Port.port1:
                ADCPin = AnalogPin.P1;
                break;
            case hicbit_Port.port2:
                ADCPin = AnalogPin.P2;
                break;
            case hicbit_Port.port3:
                ADCPin = AnalogPin.P3;
                break;
            case hicbit_Port.port4:
                ADCPin = AnalogPin.P4;
                break;
        }
        let adValue = pins.analogReadPin(ADCPin);
        adValue = adValue * 255 / 1023;
        return Math.round(adValue);
    }

    /**
    * Get the obstacle avoidance sensor status,1 detect obstacle,0 no detect obstacle 避障判断
    */
    //% weight=93 blockId=hicbit_avoidSensor block="Obstacle avoidance sensor|port %port|detect obstacle"
    export function hicbit_avoidSensor(port: hicbit_Port): boolean {
        let status = 0;
        let flag: boolean = false;
        switch (port) {
            case hicbit_Port.port1:
                pins.setPull(DigitalPin.P15, PinPullMode.PullUp);
                status = pins.digitalReadPin(DigitalPin.P15);
                break;
            case hicbit_Port.port2:
                pins.setPull(DigitalPin.P13, PinPullMode.PullUp);
                status = pins.digitalReadPin(DigitalPin.P13);
                break;
            case hicbit_Port.port3:
                pins.setPull(DigitalPin.P14, PinPullMode.PullUp);
                status = pins.digitalReadPin(DigitalPin.P14);
                break;
                // if (P14_ad > 0xA)
                //     status = 1
                // else
                //     status = 0;
                // break;
            case hicbit_Port.port4:
                pins.setPull(DigitalPin.P10, PinPullMode.PullUp);
                status = pins.digitalReadPin(DigitalPin.P10);
                break;
        }
        if (status == 1)
            flag = false;
        else
            flag = true;
        return flag;
    }

    /**
    * Get the ad value of the Sound sensor moudule 声音AD
    */
    //% weight=92 blockId=hicbit_getSoundsensorValue  block="Get Sound sensor Value|port %port|value(0~255)"
    export function hicbit_getSoundsensorValue(port: hicbit_Port): number {
        let ADCPin: AnalogPin;
        switch (port) {
            case hicbit_Port.port1:
                ADCPin = AnalogPin.P1;
                break;
            case hicbit_Port.port2:
                ADCPin = AnalogPin.P2;
                break;
            case hicbit_Port.port3:
                ADCPin = AnalogPin.P3;
                break;
            case hicbit_Port.port4:
                ADCPin = AnalogPin.P4;
                break;
        }
        let adValue = pins.analogReadPin(ADCPin);
        adValue = adValue * 255 / 1023;
        return Math.round(adValue);
    }

    /**
    * Set the Sound sensor status,1 detect the sound source,0 no detect the sound source 声音
    */
    //% weight=91 blockId=hicbit_SoundSensor block="Set the Sound sensor|port %port|detect the sound source"
    export function hicbit_SoundSensor(port: hicbit_Port): boolean {
        let status = 0;
        let flag: boolean = false;
        switch (port) {
            case hicbit_Port.port1:
                pins.setPull(DigitalPin.P15, PinPullMode.PullUp);
                status = pins.digitalReadPin(DigitalPin.P15);
                break;
            case hicbit_Port.port2:
                pins.setPull(DigitalPin.P13, PinPullMode.PullUp);
                status = pins.digitalReadPin(DigitalPin.P13);
                break;
            case hicbit_Port.port3:
                pins.setPull(DigitalPin.P14, PinPullMode.PullUp);
                status = pins.digitalReadPin(DigitalPin.P14);
                break;
            case hicbit_Port.port4:
                pins.setPull(DigitalPin.P10, PinPullMode.PullUp);
                status = pins.digitalReadPin(DigitalPin.P10);
                break;
        }
        if (status == 1)
            flag = false;
        else
            flag = true;
        return flag;
    }

    /**
    * Get the collision sensor status,1 trigger,0 no trigger 碰撞
    */
    //% weight=90 blockId=hicbit_collisionsensor block="collision sensor|port %port|is trigger"    
    export function hicbit_collisionsensor(port: hicbit_Port): boolean {
        let status = 0;
        let flag: boolean = false;
        switch (port) {
            case hicbit_Port.port1:
                pins.setPull(DigitalPin.P15, PinPullMode.PullUp);
                status = pins.digitalReadPin(DigitalPin.P15);
                break;
            case hicbit_Port.port2:
                pins.setPull(DigitalPin.P13, PinPullMode.PullUp);
                status = pins.digitalReadPin(DigitalPin.P13);
                break;
            case hicbit_Port.port3:
                pins.setPull(DigitalPin.P14, PinPullMode.PullUp);
                status = pins.digitalReadPin(DigitalPin.P14);
                break;
            case hicbit_Port.port4:
                pins.setPull(DigitalPin.P10, PinPullMode.PullUp);
                status = pins.digitalReadPin(DigitalPin.P10);
                break;
        }
        if (status == 1)
            flag = false;
        else
            flag = true;
        return flag;
    }


    

    /**
     * Determine the direction of remote sensing.
     */
    //% weight=88 blockId=hicbit_Rocker1 block="Rocker|port %port| value |%value|"
    export function hicbit_Rocker1(port: hicbit_Port, value: enRocker): boolean {
        let ADCPin: AnalogPin;
        let ports: DigitalPin;
        let x;
        let y;
        let flag: boolean = false;
        let now_state = enRocker.Nostate;

        switch (port) {         
            case hicbit_Port.port1:
                ports = DigitalPin.P15;
                ADCPin = AnalogPin.P1;
                break;
            case hicbit_Port.port2:
                ports = DigitalPin.P13;
                ADCPin = AnalogPin.P2;
                break;
            case hicbit_Port.port3:
                ports = DigitalPin.P14;
                ADCPin = AnalogPin.P3;
                break;
            case hicbit_Port.port4:
                ports = DigitalPin.P10;
                ADCPin = AnalogPin.P4;
                break;
        }
        pins.digitalWritePin(ports, 0);
        x = pins.analogReadPin(ADCPin);//x轴模拟量获取
        basic.pause(10);
        pins.digitalWritePin(ports, 1);
        y = pins.analogReadPin(ADCPin);//y轴模拟量获取

        if (x < 100) // 上
        {
            now_state = enRocker.Up;
        }
        else if (x > 800) //下
        {
            now_state = enRocker.Down;
        }
        else  // 左右
        {
            if (y < 100) //右
            {
                now_state = enRocker.Left;
            }
            else if (y > 800) //左
            {
                now_state = enRocker.Right;
            }
        }
        if (now_state == value)
            flag = true;
        else
            flag = false;
        return flag;
    }

    /**
    * Get the ad value of the Electronic gyroscope moudule 电子陀螺仪AD
    */
    //% weight=89 blockId=hicbit_getGyroscopGeValue  block="Get Electronic gyroscope Angle value|port %port|value(0~360)"
    export function hicbit_getGyroscopGeValue(port: hicbit_Port): number {
        let ADCPin: AnalogPin;
        switch (port) {
            case hicbit_Port.port1:
                ADCPin = AnalogPin.P1;
                break;
            case hicbit_Port.port2:
                ADCPin = AnalogPin.P2;
                break;
            case hicbit_Port.port3:
                ADCPin = AnalogPin.P3;
                break;
            case hicbit_Port.port4:
                ADCPin = AnalogPin.P4;
                break;
        }
        let adValue = pins.analogReadPin(ADCPin);
        adValue = adValue * 360 / 1023;
        return Math.round(adValue);
    }

    /**
     * get dht11 temperature and humidity Value
     **/
    //% weight=87 blockId="hicbit_getDHT11value" block="DHT11 set port %port|get %dhtResult"
    export function hicbit_getDHT11value(port: hicbit_Port,dhtResult: Dht11Result): number {
        let dht11pin: DigitalPin;
        switch (port) {
            case hicbit_Port.port1:
                dht11pin = DigitalPin.P1;
                break;
            case hicbit_Port.port2:
                dht11pin = DigitalPin.P2;
                break;
            case hicbit_Port.port3:
                dht11pin = DigitalPin.P3;
                break;
            case hicbit_Port.port4:
                dht11pin = DigitalPin.P4;
                break;
        
        }
        pins.digitalWritePin(dht11pin, 0);
        basic.pause(18);
        let i = pins.digitalReadPin(dht11pin);
        pins.setPull(dht11pin, PinPullMode.PullUp);
        switch (dhtResult) {
            case 0:
                let dhtvalue1 = 0;
                let dhtcounter1 = 0;
                while (pins.digitalReadPin(dht11pin) == 1);
                while (pins.digitalReadPin(dht11pin) == 0);
                while (pins.digitalReadPin(dht11pin) == 1);
                for (let i = 0; i <= 32 - 1; i++) {
                    while (pins.digitalReadPin(dht11pin) == 0)
                        dhtcounter1 = 0;
                    while (pins.digitalReadPin(dht11pin) == 1) {
                        dhtcounter1 += 1;
                    }
                    if (i > 15) {
                        if (dhtcounter1 > 2) {
                            dhtvalue1 = dhtvalue1 + (1 << (31 - i));
                        }
                    }
                }
                return ((dhtvalue1 & 0x0000ff00) >> 8);
                break;
            case 1:
                while (pins.digitalReadPin(dht11pin) == 1);
                while (pins.digitalReadPin(dht11pin) == 0);
                while (pins.digitalReadPin(dht11pin) == 1);
                let dhtvalue = 0;
                let dhtcounter = 0;
                for (let i = 0; i <= 32 - 1; i++) {
                    while (pins.digitalReadPin(dht11pin) == 0)
                        dhtcounter = 0;
                    while (pins.digitalReadPin(dht11pin) == 1) {
                        dhtcounter += 1;
                    }
                    if (i > 15) {
                        if (dhtcounter > 2) {
                            dhtvalue = dhtvalue + (1 << (31 - i));
                        }
                    }
                }
                return Math.round((((dhtvalue & 0x0000ff00) >> 8) * 9 / 5) + 32);
                break;
            case 2:
                while (pins.digitalReadPin(dht11pin) == 1);
                while (pins.digitalReadPin(dht11pin) == 0);
                while (pins.digitalReadPin(dht11pin) == 1);

                let value = 0;
                let counter = 0;

                for (let i = 0; i <= 8 - 1; i++) {
                    while (pins.digitalReadPin(dht11pin) == 0)
                        counter = 0;
                    while (pins.digitalReadPin(dht11pin) == 1) {
                        counter += 1;
                    }
                    if (counter > 3) {
                        value = value + (1 << (7 - i));
                    }
                }
                return value;
            default:
                return 0;
        }
        
    }

}

/**
 * IR remote
 */
//% color=50 weight=7
//% icon="\uf1eb"
namespace IR {

    // export enum hicbit_Port_IR {
    //     //% block="port 1"
    //     port1 = 21,
    //     //% block="port 2"
    //     port2 = 23,
    //     //% block="port 3"
    //     port3 = 22,
    //     //% block="port 4"
    //     port4 = 6,
    // }

    /**
    * initialization
    */
    //% blockId=ir_init
    //% blockGap=20 weight=90
    //% block="connect ir receiver to %pin"
    //% shim=IR::init
    export function init(pin: hicbit_Port_IR): void {
        return
    }
    
    /**
    * button pushed.
    */
    //% blockId=ir_received_event
    //% blockGap=20 weight=70
    //% block="on |%btn| button pressed"
    //% shim=IR::onPressEvent
    export function onPressEvent(btn: RemoteButton, body:Action): void {
        return
    }
    
}

/**
 * RGB light
 */
//% color=#CD9B9B weight=6
//% icon="\uf0eb"
namespace RGB_light {

    export enum hicbit_Port {
        //% block="port A"
        port1 = 0x01,
        //% block="port B"
        port2 = 0x02,
        //% block="port C"
        port3 = 0x03,
        //% block="Port D"
        port4 = 0x04
    }

    let lhRGBLight: hicbitRGBLight.LHhicbitRGBLight;
    /**
	 * Initialize Light belt
	 */
    //% weight=100 blockId=hicbit_initRGBLight block="Initialize light belt at port %port"
    export function hicbit_initRGBLight(port: hicbit_Port) {
        switch (port) {
            case hicbit_Port.port1:
                if (!lhRGBLight) {
                    lhRGBLight = hicbitRGBLight.create(DigitalPin.P15, 3, hicbitRGBPixelMode.RGB);
                }
                break;
            case hicbit_Port.port2:
                if (!lhRGBLight) {
                    lhRGBLight = hicbitRGBLight.create(DigitalPin.P13, 3, hicbitRGBPixelMode.RGB);
                }
                break;
            case hicbit_Port.port3:
                if (!lhRGBLight) {
                    lhRGBLight = hicbitRGBLight.create(DigitalPin.P14, 3, hicbitRGBPixelMode.RGB);
                }
                break;
            case hicbit_Port.port4:
                if (!lhRGBLight) {
                    lhRGBLight = hicbitRGBLight.create(DigitalPin.P10, 3, hicbitRGBPixelMode.RGB);
                }
                break;
        }
        lhRGBLight.clear();
    }
    
    /**
	 * Set RGB
	 */
    //% weight=99 blockId=hicbit_setPixelRGB block="Set light belt at|%lightoffset|color to |red %red|and|green %green|and|blue %blue|"
    //% inlineInputMode=inline
    //% red.min=0 red.max=255
    //% green.min=0 green.max=255
    //% blue.min=0 blue.max=255
    export function hicbit_setPixelRGB(lightoffset: hicbitLight, red: number, green: number, blue: number) {
        if (lightoffset == lhRGBLight._length)//全部
        {
            for (let i = 0; i < lhRGBLight._length; i++)
            {
                lhRGBLight.RGB(i, red, green, blue);     
            }
        }
        else
        {
            lhRGBLight.RGB(lightoffset, red, green, blue); 
        }
    }

    /**
     * Display the colored lights, and set the color of the colored lights to match the use. After setting the color of the colored lights, the color of the lights must be displayed.
     */
    //% weight=98 blockId=hicbit_showLight block="Show light belt"
    export function hicbit_showLight() {
        lhRGBLight.show();
    }

    /**
     * Clear the color of the colored lights and turn off the lights.
     */
    //% weight=97 blockGap=20 blockId=hicbit_clearLight block="Clear light"
    export function hicbit_clearLight() {
        lhRGBLight.clear();
    }
    
}


/*
 Display package
*/
//% weight=5 icon="\uf108" color=#6E8B3D
namespace Display {

    export let NEW_LINE = "\r\n";

    export enum Linenum {
        //% block="first_line"
        first_line = 0x01,
        //% block="second_line"
        second_line = 0x02,
        //% block="Third_line"
        Third_line = 0x03,
        //% block="Fourth_line"
        Fourth_line = 0x04,
        //% block="Fifth_line"
        Fifth_line = 0x05,
        
    }

    export enum unit {
        //% block="none"
        none = 0x01,
        //% block="m"
        m = 0x02,
        //% block="cm"
        cm = 0x03,
        //% block="mm"
        mm = 0x04,
        //% block="C"
        C = 0x05,
        //% block="F"
        F = 0x06,
        //% block="%"
        bf = 0x07
        
    }
    
    /**
        * Display clear
        */
    //% weight=100 blockId=Clearscreen block="Clear screen"
    export function Clearscreen(): void {
        let buf = pins.createBuffer(30);//清屏
        buf[0] = 0xDD;
        buf[1] = 9;
	    buf[2] = 0x0d;
	    buf[3] = 0x0a;
        serial.writeBuffer(buf);
        //serial.writeString(NEW_LINE);
        basic.pause(200);
    }

    /**
        * Display ultrasonic distance
        */
    //% weight=99 blockId=setDisplay block="Display %line |text: %text | value: %value| unit1: %unit1"
    export function setDisplay(line: Linenum, text: string, value: number = 0, unit1: unit): void {
        let num: number = 1;
        let text2: string = " ";
        let buf = pins.createBuffer(2);
        switch (line) {
            case Linenum.first_line:
                num = 4;
                break;
            case Linenum.second_line:
                num = 5;
                break;
            case Linenum.Third_line:
                num = 6;
                break;
            case Linenum.Fourth_line:
                num = 7;
                break;
            case Linenum.Fifth_line:
                num = 8;
                break;
        }
        buf[0] = 0xDD;
        buf[1] = num;
        serial.writeBuffer(buf);
        if (!text) text = "";
        serial.writeString(text);
        serial.writeString(value.toString());
        switch (unit1) {
            case unit.none:
                text2 = " ";
                break;
            case unit.m:
                text2 = "m";
                break;
            case unit.cm:
                text2 = "cm";
                break;
            case unit.mm:
                text2 = "mm";
                break;
            case unit.C:
                text2 = "C";
                break;
            case unit.F:
                text2 = "F";
                break;
            case unit.bf:
                text2 = "%";
                break;
            
        }
        serial.writeString(text2);
        serial.writeString(NEW_LINE);
        basic.pause(200);
    }

}
	
	
	/**
 * 自定义图形块
 */
//% weight=5 color=#0fbc12 icon="\uf111"
namespace MPU6050{
    //	加速度，陀螺仪，磁力 Acceleration, gyroscope, magnetic
    // 定义MPU6050内部地址
    //****************************************
    const   SMPLRT_DIV=		0x19	//陀螺仪采样率，典型值：0x07(125Hz)
    const	CONFIG=			0x1A	//低通滤波频率，典型值：0x06(5Hz)
    const	GYRO_CONFIG		=0x1B	//陀螺仪自检及测量范围，典型值：0x18(不自检，2000deg/s)
    const	ACCEL_CONFIG	=0x1C	//加速计自检、测量范围及高通滤波频率，典型值：0x01(不自检，2G，5Hz)
    const	ACCEL_XOUT_H	=0x3B	//加速度地址
    const	ACCEL_XOUT_L	=0x3C
    const	ACCEL_YOUT_H	=0x3D
    const	ACCEL_YOUT_L	=0x3E
    const	ACCEL_ZOUT_H	=0x3F
    const	ACCEL_ZOUT_L	=0x40
    const	TEMP_OUT_H		=0x41	//温度地址
    const	TEMP_OUT_L		=0x42
    const	GYRO_XOUT_H		=0x43	//陀螺仪地址
    const	GYRO_XOUT_L		=0x44	
    const	GYRO_YOUT_H		=0x45
    const	GYRO_YOUT_L		=0x46
    const	GYRO_ZOUT_H		=0x47
    const	GYRO_ZOUT_L		=0x48
    const MAG_ADDRESS		=0x0c
    const MAG_XOUT_H		=0x04		//磁力传感器地址
    const MAG_XOUT_L		=0x03
    const MAG_YOUT_H		=0x06
    const MAG_YOUT_L		=0x05
    const MAG_ZOUT_H		=0x08
    const MAG_ZOUT_L		=0x07
    const	PWR_MGMT_1		=0x6B	//电源管理，典型值：0x00(正常启用)
    const	WHO_AM_I		=0x75	//IIC地址寄存器(默认数值0x68，只读)
    const	MPU6050_Addr=   0xD0	  //定义器件在IIC总线中的从地址,根据ALT  ADDRESS地址引脚不同修改


    export enum MPU6050Result {
        //% block="G_X"
        G_X,
        //% block="G_Y"
        G_Y,
        //% block="G_Z"
        G_Z,
        //% block="T_T"
        T_T,
        //% block="A_X"
        A_X,
        //% block="A_Y"
        A_Y,
        //% block="A_Z"
        A_Z
    }

    function i2cwrite(addr: number, reg: number, value: number) {
        let buf = pins.createBuffer(2)
        buf[0] = reg
        buf[1] = value
        pins.i2cWriteBuffer(addr, buf)  
    }
    //HAL_I2C_Mem_Write(uint16_t DevAddress,  MemAddress,  MemAddSize,  *pData,  Size,  Timeout)
    function i2cread(addr: number, reg: number) {
        pins.i2cWriteNumber(addr, reg, NumberFormat.UInt8BE);
        let val = pins.i2cReadNumber(addr, NumberFormat.UInt8BE);
        return val;
    }

    function Init_MPU6050(){
    /**
     * 
     * HAL_I2C_Mem_Write(&hi2c1,MPU6050_Addr,PWR_MGMT_1,8,(unsigned char*)0X00,8,0XFFFF);
	    HAL_I2C_Mem_Write(&hi2c1,MPU6050_Addr,SMPLRT_DIV,8,(unsigned char*)0x07,8,0XFFFF);
	    HAL_I2C_Mem_Write(&hi2c1,MPU6050_Addr,CONFIG,8,(unsigned char*)0x06,8,0XFFFF);
	    HAL_I2C_Mem_Write(&hi2c1,MPU6050_Addr,GYRO_CONFIG,8,(unsigned char*)0x18,8,0XFFFF);
	    HAL_I2C_Mem_Write(&hi2c1,MPU6050_Addr,ACCEL_CONFIG,8,(unsigned char*)0x01,8,0XFFFF);
     */
        i2cwrite(MPU6050_Addr,PWR_MGMT_1,0X00)   
        i2cwrite(MPU6050_Addr,SMPLRT_DIV,0x07)
        i2cwrite(MPU6050_Addr,CONFIG,0x06)
        i2cwrite(MPU6050_Addr,GYRO_CONFIG,0x18)
        i2cwrite(MPU6050_Addr,ACCEL_CONFIG,0X01)
    }

    /**
     * read mpu6050 
     */
    //% weight=100 blockGap=20 blockId=READ_MPU6050 block="READ MPU6050"
    export function READ_MPU6050(){
        Init_MPU6050()
        let BUF0 = pins.createBuffer(10)
        BUF0[0]=i2cread(MPU6050_Addr,GYRO_XOUT_L)
        BUF0[1]=i2cread(MPU6050_Addr,GYRO_XOUT_H)//X
        
        let G_X = (BUF0[1]<<8)|BUF0[0]
        G_X = G_X*250/327.68


        BUF0[2]=i2cread(MPU6050_Addr,GYRO_YOUT_L)
        BUF0[3]=i2cread(MPU6050_Addr,GYRO_YOUT_L)//Y
        let G_Y= (BUF0[3]<<8)|BUF0[2]
        G_Y = G_Y*250/327.68

        BUF0[4]=i2cread(MPU6050_Addr,GYRO_ZOUT_L)
        BUF0[5]=i2cread(MPU6050_Addr,GYRO_ZOUT_H)//Z
        let G_Z = (BUF0[5]<<8)|BUF0[4]
        G_Z = G_Z*250/327.68

        BUF0[6]=i2cread(MPU6050_Addr,TEMP_OUT_H)
        BUF0[7]=i2cread(MPU6050_Addr,TEMP_OUT_L)//T
        let T_T = (BUF0[7]<<8)|BUF0[6]
        T_T = T_T*250/327.68
        BUF0[0]=i2cread(MPU6050_Addr,ACCEL_XOUT_L)
        BUF0[1]=i2cread(MPU6050_Addr,ACCEL_XOUT_H)//X
        let A_X = (BUF0[1]<<8)|BUF0[0]
        A_X = A_X/163.84;


        BUF0[2]=i2cread(MPU6050_Addr,ACCEL_YOUT_L)
        BUF0[3]=i2cread(MPU6050_Addr,ACCEL_YOUT_H)//Y
        let A_Y= (BUF0[3]<<8)|BUF0[2]
        A_Y = A_Y/163.84;

        BUF0[4]=i2cread(MPU6050_Addr,ACCEL_ZOUT_L)
        BUF0[5]=i2cread(MPU6050_Addr,ACCEL_ZOUT_H)//Z
        let A_Z = (BUF0[5]<<8)|BUF0[4]
        A_Z = A_Z/163.84; 

     return G_X
    }



}
