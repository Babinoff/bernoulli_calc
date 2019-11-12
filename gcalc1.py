# Библиотека дайсов
dice_to_hit = {"1+":1,"2+":100/6*5/100,"3+":100/6*4/100,"4+":100/6*3/100,"5+":100/6*2/100,"6+":100/6*1/100}
dice_to_wund = {"1+":6,"2+":5,"3+":4,"4+":3,"5+":2,"6+":1}
dice_armor_save = {"No":0,"2+":1,"3+":2,"4+":3,"5+":4,"6+":5}
dice_fnp = {"No":0,"2+":1,"3+":2,"4+":3,"5+":4,"6+":5}

class WhCalc:
	dh = None
	dw = None
	da = "No"
	df = "No"
	ac = 3

	# Библиотека дайсов
	dice_to_hit = {"1+":1,"2+":100/6*5/100,"3+":100/6*4/100,"4+":100/6*3/100,"5+":100/6*2/100,"6+":100/6*1/100}
	dice_to_wund = {"1+":6,"2+":5,"3+":4,"4+":3,"5+":2,"6+":1}
	dice_armor_save = {"1+":0,"2+":1,"3+":2,"4+":3,"5+":4,"6+":5}
	dice_fnp = {"1+":0,"2+":1,"3+":2,"4+":3,"5+":4,"6+":5}
	
	def table(sender):
		name = sender.tableview.name
		if name == "t_hit":
			WhCalc.dh = sender.items[sender.selected_row]
		if name == "t_wnd":
			WhCalc.dw = sender.items[sender.selected_row]
		if name == "t_arm":
			WhCalc.da = sender.items[sender.selected_row]
		if name == "t_fnp":
			WhCalc.df = sender.items[sender.selected_row]
		#print(name)
	
	def acount(sender):
		st = int(sender.text)
		WhCalc.ac = st
		#print(dir(sender))
		#print(st)
	
	def go(self):
		dh = dice_to_hit[WhCalc.dh]
		dw = dice_to_wund[WhCalc.dw]
		da = dice_armor_save[WhCalc.da]
		df = dice_fnp[WhCalc.df]
		ac = WhCalc.ac
		brn_p = WhCalc.dice_drop(dh,dw,da,df)
		#print(brn_p)

		ok_nums_list =[]
		brnpsum = []
		n = ac
		for k in range(ac+1):
			#try:
			brn_f = 100*WhCalc.brn(brn_p,k,n)
			brnpsum.append(brn_f)
			itogo_int = int(round(sum(brnpsum),0))
			itogo_float = sum(brnpsum)
			ok_nums_list.append((itogo_int,itogo_float))
			#except Exception as e:
			#	ok_nums_list.append(e)
		string_list = []
		for i,num in enumerate(ok_nums_list):
			try:
				if i == 0:
					string_list.append(str(i)+" wound s 0"+" to " +str(ok_nums_list[0][0]))
				else:
					if ok_nums_list[i-1][0] < 99:
						string_list.append(str(i)+" wound s "+str(ok_nums_list[i-1][0]+1)+" to " +str(num[0]))
					else:
						string_list.append(str(i)+" wound s "+str(ok_nums_list[i-1][1])+" to " +str(num[1]))	
			except Exception as e:
				string_list.append(e)
		txtv.text = "\n ".join(string_list)
		#datalist.items = string_list
		#listv.reload()
		
		#datalist
		#print(string_list)
		
	def brn(p,k,n):
		from math import factorial as fc
		return (fc(n)/(fc(k)*fc(n-k)))*(p**k*(1-p)**(n-k))	
		
	def dice_drop(dice_to_hit,dice_to_wund,dice_armor_save=None,dice_fnp=None):
		if not dice_armor_save and not dice_fnp:
			value_p = dice_to_hit/6*dice_to_wund
		elif dice_armor_save and not dice_fnp:
			value_p = dice_to_hit/6*dice_to_wund/6*dice_armor_save
		elif not dice_armor_save and dice_fnp:
			value_p = dice_to_hit/6*dice_to_wund/6*dice_fnp
		elif dice_armor_save and dice_fnp:
			value_p = dice_to_hit/6*dice_to_wund/6*dice_armor_save/6*dice_fnp
		else:
			value_p = "how do you get whis? post me a later"
		return value_p
		
#class data_s(ListDataSource()):
	#__init__
		
import ui
v = ui.load_view()
table = v['t_hit']
txtv = v['textv']
#listv = v['ok_list']
#datalist = ui.ListDataSource([])
#listv.data_sorce = datalist
#print(dir(listv.data_sorce))

#table.hidden = True
#options = table.data_source.items
#print(dh)
#table.items = options
#table.height = min(dropDown.row_height * len(options), 5*dropDown.row_height)
v.present('sheet')
#print(ui.ListDataSource)

